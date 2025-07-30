/**
 * MASKINDATA-HANTERARE FÖR ADMINPANELEN
 * 
 * Hanterar CRUD-operationer för maskindata med redigerbar tabell
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2, Save, X, AlertCircle, Loader2, Check, Copy } from 'lucide-react';
import { machineApiClient, type Machine } from '@/utils/machineApiClient';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Machine interface importeras nu från API-klienten

interface MachineFormData {
  name: string;
  price_eur: number;
  is_premium: boolean;
  uses_credits: boolean;
  credit_min: number;
  credit_max: number;
  flatrate_amount: number;
  default_customer_price: number;
  default_leasing_period: number;
  leasing_min: number;
  leasing_max: number;
  credits_per_treatment: number;
  description: string;
  category: string;
  is_active: boolean;
  leasing_tariffs: string; // JSON string för redigering
}

// API-anrop hanteras nu av machineApiClient

const CATEGORY_OPTIONS = [
  { value: 'treatment', label: 'Behandling' },
  { value: 'handheld', label: 'Handhållen' },
  { value: 'premium', label: 'Premium' },
  { value: 'special', label: 'Special' }
];

const MachineDataManager: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<MachineFormData>({
    name: '',
    price_eur: 0,
    is_premium: false,
    uses_credits: true,
    credit_min: 0,
    credit_max: 1000,
    flatrate_amount: 0,
    default_customer_price: 2500,
    default_leasing_period: 60,
    leasing_min: 24,
    leasing_max: 120,
    credits_per_treatment: 1,
    description: '',
    category: 'treatment',
    is_active: true,
    leasing_tariffs: JSON.stringify({ "36": 0, "48": 0, "60": 0, "72": 0 }, null, 2)
  });

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await machineApiClient.fetchMachines();
      setMachines(data);
    } catch (error) {
      console.error('Error fetching machines:', error);
      setError(`Kunde inte hämta maskindata: ${error instanceof Error ? error.message : 'Okänt fel'}`);
      toast({
        title: "Fel",
        description: "Kunde inte hämta maskindata",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateFormData = (data: MachineFormData): string[] => {
    const errors: string[] = [];
    
    if (!data.name.trim()) errors.push('Namn är obligatoriskt');
    if (data.price_eur <= 0) errors.push('Pris måste vara större än 0');
    if (data.credit_min >= data.credit_max) errors.push('Credit min måste vara mindre än credit max');
    if (data.leasing_min >= data.leasing_max) errors.push('Leasing min måste vara mindre än leasing max');
    
    try {
      JSON.parse(data.leasing_tariffs);
    } catch {
      errors.push('Leasing-tariffer måste vara giltig JSON');
    }
    
    return errors;
  };

  const handleCreate = async () => {
    const errors = validateFormData(formData);
    if (errors.length > 0) {
      toast({
        title: "Valideringsfel",
        description: errors.join(', '),
        variant: "destructive",
      });
      return;
    }

    try {
      const requestData = {
        ...formData,
        leasing_tariffs: JSON.parse(formData.leasing_tariffs)
      };

      await machineApiClient.createMachine(requestData);
      await fetchMachines();
      setIsDialogOpen(false);
      resetForm();
      
      toast({
        title: "Framgång",
        description: "Maskin skapad framgångsrikt",
      });
    } catch (error) {
      console.error('Error creating machine:', error);
      toast({
        title: "Fel",
        description: `Kunde inte skapa maskin: ${error instanceof Error ? error.message : 'Okänt fel'}`,
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (id: string, updates: Partial<Machine>) => {
    try {
      console.log('Updating machine:', id, updates); // Debug log
      await machineApiClient.updateMachine(id, updates);
      await fetchMachines();
      setEditingId(null);
      
      toast({
        title: "Framgång",
        description: "Maskin uppdaterad framgångsrikt",
      });
    } catch (error) {
      console.error('Error updating machine:', error);
      toast({
        title: "Fel",
        description: `Kunde inte uppdatera maskin: ${error instanceof Error ? error.message : 'Okänt fel'}`,
        variant: "destructive",
      });
    }
  };

  const startEditing = (machine: Machine) => {
    setEditingId(machine.id);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleInlineUpdate = async (machine: Machine, field: string, value: any) => {
    const updates = { [field]: value };
    await handleUpdate(machine.id, updates);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Är du säker på att du vill radera maskinen "${name}"? Detta kan inte ångras.`)) {
      return;
    }

    try {
      await machineApiClient.deleteMachine(id);
      await fetchMachines();
      
      toast({
        title: "Framgång",
        description: "Maskin raderad framgångsrikt",
      });
    } catch (error) {
      console.error('Error deleting machine:', error);
      toast({
        title: "Fel",
        description: `Kunde inte radera maskin: ${error instanceof Error ? error.message : 'Okänt fel'}`,
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = async (machine: Machine) => {
    try {
      const duplicateData = {
        name: `Kopia av ${machine.name}`,
        price_eur: machine.price_eur,
        is_premium: machine.is_premium,
        uses_credits: machine.uses_credits,
        credit_min: machine.credit_min,
        credit_max: machine.credit_max,
        flatrate_amount: machine.flatrate_amount,
        default_customer_price: machine.default_customer_price,
        default_leasing_period: machine.default_leasing_period,
        leasing_min: machine.leasing_min,
        leasing_max: machine.leasing_max,
        credits_per_treatment: machine.credits_per_treatment,
        description: machine.description || '',
        category: machine.category,
        is_active: machine.is_active,
        leasing_tariffs: machine.leasing_tariffs
      };

      await machineApiClient.createMachine(duplicateData);
      await fetchMachines();
      
      toast({
        title: "Framgång",
        description: `Maskinen "${machine.name}" kopierades framgångsrikt`,
      });
    } catch (error) {
      console.error('Error duplicating machine:', error);
      toast({
        title: "Fel",
        description: `Kunde inte kopiera maskin: ${error instanceof Error ? error.message : 'Okänt fel'}`,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price_eur: 0,
      is_premium: false,
      uses_credits: true,
      credit_min: 0,
      credit_max: 1000,
      flatrate_amount: 0,
      default_customer_price: 2500,
      default_leasing_period: 60,
      leasing_min: 24,
      leasing_max: 120,
      credits_per_treatment: 1,
      description: '',
      category: 'treatment',
      is_active: true,
      leasing_tariffs: JSON.stringify({ "36": 0, "48": 0, "60": 0, "72": 0 }, null, 2)
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Laddar maskindata...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={fetchMachines} className="mt-4">
            Försök igen
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Maskindata-hantering</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Lägg till maskin
                </Button>
              </DialogTrigger>
               <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                 <DialogHeader>
                   <DialogTitle>{editingId ? 'Redigera maskin' : 'Lägg till ny maskin'}</DialogTitle>
                 </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Namn *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price_eur">Pris (EUR) *</Label>
                    <Input
                      id="price_eur"
                      type="number"
                      value={formData.price_eur}
                      onChange={(e) => setFormData({ ...formData, price_eur: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Kategori</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Välj kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="default_customer_price">Standard kundpris</Label>
                    <Input
                      id="default_customer_price"
                      type="number"
                      value={formData.default_customer_price}
                      onChange={(e) => setFormData({ ...formData, default_customer_price: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="credit_min">Credit min</Label>
                    <Input
                      id="credit_min"
                      type="number"
                      value={formData.credit_min}
                      onChange={(e) => setFormData({ ...formData, credit_min: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="credit_max">Credit max</Label>
                    <p className="text-xs text-muted-foreground mb-1">Max antal credits per månad</p>
                    <Input
                      id="credit_max"
                      type="number"
                      value={formData.credit_max}
                      onChange={(e) => setFormData({ ...formData, credit_max: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="flatrate_amount">Flatrate belopp</Label>
                    <Input
                      id="flatrate_amount"
                      type="number"
                      value={formData.flatrate_amount}
                      onChange={(e) => setFormData({ ...formData, flatrate_amount: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="credits_per_treatment">Credits per behandling</Label>
                    <Input
                      id="credits_per_treatment"
                      type="number"
                      value={formData.credits_per_treatment}
                      onChange={(e) => setFormData({ ...formData, credits_per_treatment: Number(e.target.value) })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="description">Beskrivning</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="leasing_tariffs">Leasing-tariffer (JSON)</Label>
                    <Textarea
                      id="leasing_tariffs"
                      value={formData.leasing_tariffs}
                      onChange={(e) => setFormData({ ...formData, leasing_tariffs: e.target.value })}
                      className="font-mono text-sm"
                      rows={4}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_premium"
                      checked={formData.is_premium}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_premium: checked })}
                    />
                    <div>
                      <Label htmlFor="is_premium">Premium maskin</Label>
                      <p className="text-xs text-muted-foreground">Flagga för avancerade/dyrare maskiner</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="uses_credits"
                      checked={formData.uses_credits}
                      onCheckedChange={(checked) => setFormData({ ...formData, uses_credits: checked })}
                    />
                    <Label htmlFor="uses_credits">Använder credits</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Aktiv</Label>
                  </div>
                </div>
                 <div className="flex justify-end gap-2 mt-6">
                   <Button variant="outline" onClick={() => {
                     setIsDialogOpen(false);
                     setEditingId(null);
                     resetForm();
                   }}>
                     Avbryt
                   </Button>
                   <Button onClick={editingId ? async () => {
                     // Uppdatera befintlig maskin
                     const errors = validateFormData(formData);
                     if (errors.length > 0) {
                       toast({
                         title: "Valideringsfel",
                         description: errors.join(', '),
                         variant: "destructive",
                       });
                       return;
                     }
                     const updates = {
                       name: formData.name,
                       price_eur: formData.price_eur,
                       is_premium: formData.is_premium,
                       uses_credits: formData.uses_credits,
                       credit_min: formData.credit_min,
                       credit_max: formData.credit_max,
                       flatrate_amount: formData.flatrate_amount,
                       default_customer_price: formData.default_customer_price,
                       default_leasing_period: formData.default_leasing_period,
                       leasing_min: formData.leasing_min,
                       leasing_max: formData.leasing_max,
                       credits_per_treatment: formData.credits_per_treatment,
                       description: formData.description,
                       category: formData.category,
                       is_active: formData.is_active,
                       leasing_tariffs: JSON.parse(formData.leasing_tariffs)
                     };
                     await handleUpdate(editingId, updates);
                     setIsDialogOpen(false);
                     setEditingId(null);
                     resetForm();
                   } : handleCreate}>
                     {editingId ? 'Uppdatera maskin' : 'Skapa maskin'}
                   </Button>
                 </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Namn</TableHead>
                  <TableHead>Pris</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Beskrivning</TableHead>
                  <TableHead>Åtgärder</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machines.map((machine) => (
                  <TableRow key={machine.id}>
                    <TableCell className="font-medium">
                      {machine.name}
                      {machine.is_premium && (
                        <Badge variant="secondary" className="ml-2">Premium</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatPrice(machine.price_eur)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{machine.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {machine.uses_credits ? (
                        <span className="text-sm">
                          {machine.credit_min}-{machine.credit_max}
                          {machine.flatrate_amount > 0 && (
                            <div className="text-xs text-muted-foreground">
                              Flatrate: {machine.flatrate_amount}
                            </div>
                          )}
                        </span>
                      ) : (
                        <Badge variant="outline">Inga credits</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={machine.is_active ? "default" : "secondary"}>
                        {machine.is_active ? "Aktiv" : "Inaktiv"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {machine.description || '-'}
                    </TableCell>
                     <TableCell>
                       <div className="flex gap-2">
                         {editingId === machine.id ? (
                           <div className="flex gap-1">
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={() => {
                                 // Visa inline edit form
                                 setFormData({
                                   name: machine.name,
                                   price_eur: machine.price_eur,
                                   is_premium: machine.is_premium,
                                   uses_credits: machine.uses_credits,
                                   credit_min: machine.credit_min,
                                   credit_max: machine.credit_max,
                                   flatrate_amount: machine.flatrate_amount,
                                   default_customer_price: machine.default_customer_price,
                                   default_leasing_period: machine.default_leasing_period,
                                   leasing_min: machine.leasing_min,
                                   leasing_max: machine.leasing_max,
                                   credits_per_treatment: machine.credits_per_treatment,
                                   description: machine.description || '',
                                   category: machine.category,
                                   is_active: machine.is_active,
                                   leasing_tariffs: JSON.stringify(machine.leasing_tariffs, null, 2)
                                 });
                                 setIsDialogOpen(true);
                                 setEditingId(null);
                               }}
                               className="flex items-center gap-1"
                             >
                               <Edit2 className="w-3 h-3" />
                               Öppna editor
                             </Button>
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={cancelEditing}
                               className="flex items-center gap-1"
                             >
                               <X className="w-3 h-3" />
                               Avbryt
                             </Button>
                           </div>
                         ) : (
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startEditing(machine)}
                                className="flex items-center gap-1"
                              >
                                <Edit2 className="w-3 h-3" />
                                Redigera
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDuplicate(machine)}
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                                title="Skapa kopia av denna maskin"
                              >
                                <Copy className="w-3 h-3" />
                                Kopiera
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(machine.id, machine.name)}
                                className="flex items-center gap-1 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-3 h-3" />
                                Radera
                              </Button>
                            </div>
                         )}
                       </div>
                     </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {machines.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Inga maskiner hittades. Lägg till en ny maskin för att komma igång.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Redigeringsmodal kan läggas till här om vi vill ha en separat edit-dialog */}
    </div>
  );
};

export default MachineDataManager;