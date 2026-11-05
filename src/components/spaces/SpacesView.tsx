import React, { useState } from 'react';
import { 
  Layers, 
  Users, 
  Check, 
  Package, 
  PlusCircle, 
  Trash2, 
  AlertCircle 
} from 'lucide-react';
import { useVenue } from '../../context/VenueContext';
import { InventoryItem } from '../../types';

export const SpacesView: React.FC = () => {
  const { areas, inventory, addInventoryItem, deleteInventoryItem } = useVenue();
  const [activeTab, setActiveTab] = useState<'areas' | 'inventory'>('areas');
  const [showAddInvModal, setShowAddInvModal] = useState(false);

  // New inventory item state
  const [invName, setInvName] = useState('');
  const [invCategory, setInvCategory] = useState<InventoryItem['category']>('Mobiliário');
  const [invQty, setInvQty] = useState(10);
  const [invCondition, setInvCondition] = useState<InventoryItem['condition']>('Excelente');
  const [invLocation, setInvLocation] = useState('Salão Nobre');

  const handleAddInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invName.trim() || invQty <= 0) return;

    addInventoryItem({
      name: invName.trim(),
      category: invCategory,
      quantity: Number(invQty),
      condition: invCondition,
      location: invLocation.trim()
    });

    setInvName('');
    setShowAddInvModal(false);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-600" />
            <span>Estrutura do Espaço Órion & Inventário</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Conheça as áreas locáveis do imóvel e faça a gestão do patrimônio de móveis e equipamentos.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('areas')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              activeTab === 'areas'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Ambientes do Espaço ({areas.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              activeTab === 'inventory'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Inventário & Patrimônio ({inventory.length})
          </button>
        </div>
      </div>

      {activeTab === 'areas' ? (
        /* Areas Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {areas.map((area) => (
            <div
              key={area.id}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs hover:border-stone-300 dark:hover:border-stone-700 transition-all flex flex-col"
            >
              {/* Image Frame */}
              <div className="relative h-60 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                <img
                  src={area.image}
                  alt={area.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>Capacidade: {area.capacity} pessoas</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    {area.name}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
                    {area.description}
                  </p>

                  {/* Features list */}
                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800">
                    <span className="text-[11px] font-semibold text-stone-400 block mb-2 uppercase tracking-wider">
                      Comodidades Inclusas no Ambiente:
                    </span>
                    <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                      {area.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                  <span className="text-stone-500">Status Operacional:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    ✓ Liberado para Locações
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Inventory Table View */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Controle de bens materiais do Órion para conferência rápida durante vistorias.
            </p>
            <button
              onClick={() => setShowAddInvModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Adicionar Item</span>
            </button>
          </div>

          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100/70 dark:bg-stone-800/60 text-stone-600 dark:text-stone-300 font-medium border-b border-stone-200 dark:border-stone-700">
                <tr>
                  <th className="p-3.5">Item / Descrição</th>
                  <th className="p-3.5">Categoria</th>
                  <th className="p-3.5 text-center">Quantidade</th>
                  <th className="p-3.5">Localização no Espaço</th>
                  <th className="p-3.5">Conservação</th>
                  <th className="p-3.5 text-center w-16">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                    <td className="p-3.5 font-semibold text-stone-900 dark:text-stone-100">
                      {item.name}
                    </td>
                    <td className="p-3.5 text-stone-600 dark:text-stone-400">
                      {item.category}
                    </td>
                    <td className="p-3.5 text-center font-mono font-bold text-stone-800 dark:text-stone-200">
                      {item.quantity} un
                    </td>
                    <td className="p-3.5 text-stone-600 dark:text-stone-400">
                      {item.location}
                    </td>
                    <td className="p-3.5">
                      <span className={`font-medium ${
                        item.condition === 'Excelente'
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : item.condition === 'Bom'
                          ? 'text-stone-700 dark:text-stone-300'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}>
                        {item.condition}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => deleteInventoryItem(item.id)}
                        className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                        title="Remover"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Inventory Item Modal */}
      {showAddInvModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Cadastrar Item no Inventário
            </h3>

            <form onSubmit={handleAddInventory} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Nome do Bem / Equipamento
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Toldo sanfonado 3x3m"
                  value={invName}
                  onChange={(e) => setInvName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Categoria
                  </label>
                  <select
                    value={invCategory}
                    onChange={(e) => setInvCategory(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    <option value="Mobiliário">Mobiliário</option>
                    <option value="Eletros">Eletros & Cozinha</option>
                    <option value="Som & Luz">Som & Luz</option>
                    <option value="Lazer & Esporte">Lazer & Piscina</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={invQty}
                    onChange={(e) => setInvQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Localização no Espaço
                  </label>
                  <input
                    type="text"
                    required
                    value={invLocation}
                    onChange={(e) => setInvLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Estado de Conservação
                  </label>
                  <select
                    value={invCondition}
                    onChange={(e) => setInvCondition(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    <option value="Excelente">Excelente</option>
                    <option value="Bom">Bom</option>
                    <option value="Atenção">Atenção / Manutenção</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddInvModal(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-amber-600 hover:bg-amber-700 rounded-lg font-semibold"
                >
                  Salvar Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
