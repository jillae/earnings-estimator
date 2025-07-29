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
import { Plus, Edit2, Trash2, Save, X, AlertCircle, Loader2 } from 'lucide-react';

interface Machine {
  id: string;
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
  description: string | null;
  category: string;
  is_active: boolean;
  leasing_tariffs: Record<string, number>;
  created_at: string;
}

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

const API_BASE_URL = `https://ejwbhvzmkmuimfqlishm.supabase.co/functions/v1/machines-api`;

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
      
      const response = await fetch(API_BASE_URL, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
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

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create machine');
      }

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
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update machine');
      }

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

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Är du säker på att du vill radera maskinen "${name}"? Detta kan inte ångras.`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete machine');
      }

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
                  <DialogTitle>Lägg till ny maskin</DialogTitle>
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
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
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
                    <Label htmlFor="is_premium">Premium maskin</Label>
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
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Avbryt
                  </Button>
                  <Button onClick={handleCreate}>
                    Skapa maskin
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingId(machine.id)}
                          className="flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          Redigera
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