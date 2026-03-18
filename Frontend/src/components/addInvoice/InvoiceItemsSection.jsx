import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, Plus, Trash2 } from 'lucide-react'
import { PRODUCTS } from './addInvoiceData'

const InvoiceItemsSection = ({ items, setItems }) => {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productSearch, setProductSearch] = useState('')
  const [productOpen, setProductOpen] = useState(false)
  const productRef = useRef(null)

  const filteredProducts = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (productRef.current && !productRef.current.contains(e.target)) {
        setProductOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAddProduct = () => {
    if (!selectedProduct) return
    const newPrice = selectedProduct.professional || 0;
    const newGovFee = selectedProduct.govt || 0;
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        no: prev.length + 1,
        product: selectedProduct,
        price: newPrice,
        govFee: newGovFee,
        gstPercentage: '',
        gstAmount: 0,
        gst: newGovFee,
        amount: newPrice + newGovFee,
      },
    ])
    setSelectedProduct(null)
    setProductSearch('')
  }

  const handleRemoveItem = (id) => {
    setItems((prev) =>
      prev
        .filter((item) => item.id !== id)
        .map((item, idx) => ({ ...item, no: idx + 1 }))
    )
  }

  const handleGstPercentageChange = (id, newPercentage) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const percentage = parseFloat(newPercentage) || 0;
          const gstAmount = (item.price * percentage) / 100;
          const govFee = item.govFee !== undefined ? item.govFee : (item.gst || 0);
          const amount = item.price + gstAmount + govFee;
          return { ...item, gstPercentage: newPercentage, gstAmount, amount };
        }
        return item;
      })
    );
  };

  const totalPrice = items.reduce((acc, i) => acc + (i.price || 0), 0)
  const totalGst = items.reduce((acc, i) => acc + (i.gstAmount || 0), 0)
  const totalAmount = items.reduce((acc, i) => acc + (i.amount || 0), 0)

  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl shadow-sm mb-6 overflow-hidden">
      <div className="p-4 border-b border-[var(--color-bg-tertiary)] bg-[var(--color-bg-tertiary)]/30">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Invoice Items</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[var(--color-bg-tertiary)] text-xs text-[var(--color-text-secondary)] uppercase tracking-wider bg-[var(--color-bg-tertiary)]/20">
              <th className="px-5 py-3 font-semibold">No</th>
              <th className="px-5 py-3 font-semibold w-full">Name</th>
              <th className="px-5 py-3 font-semibold text-right whitespace-nowrap">Price</th>
              <th className="px-5 py-3 font-semibold text-right whitespace-nowrap">GST</th>
              <th className="px-5 py-3 font-semibold text-right whitespace-nowrap">Amount</th>
              <th className="px-5 py-3 font-semibold text-center"></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-[var(--color-text-secondary)] text-sm">
                  No items added yet. Select a product and click "Add Product".
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-tertiary)]/30 transition-colors align-top">
                  <td className="px-5 py-4 text-sm font-medium text-[var(--color-text-secondary)]">{item.no}</td>
                  <td className="px-5 py-4">
                    <div className="text-sm font-semibold text-[var(--color-text-primary)]">{item.product.name}</div>
                    <div className="text-xs text-right text-white font-bold mt-1">Professional Fees ₹ {item.price.toFixed(2)}</div>
                    <div className="text-[10px] text-right text-white font-bold mt-1">
                      Govt Fees: ₹{(item.govFee !== undefined ? item.govFee : (item.gst || 0)).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-right whitespace-nowrap font-medium text-[var(--color-text-primary)]">
                    ₹{item.price.toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-sm text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1 mb-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.gstPercentage !== undefined ? item.gstPercentage : ''}
                        onChange={(e) => handleGstPercentageChange(item.id, e.target.value)}
                        className="w-16 px-2 py-1 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded text-sm text-left focus:outline-none focus:border-[var(--color-accent)]"
                        placeholder="0"
                      />
                      <span className="text-[var(--color-text-secondary)]">%</span>
                    </div>
                    <div className="text-xs font-medium text-[var(--color-text-primary)]">
                      ₹{(item.gstAmount || 0).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-right whitespace-nowrap font-bold text-[var(--color-text-primary)]">
                    ₹{item.amount.toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50/10 rounded transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}

            {/* Totals Row */}
            <tr className="bg-[var(--color-bg-tertiary)]/30 border-t border-[var(--color-bg-tertiary)]">
              <td colSpan={2} className="px-5 py-4 text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                Total
              </td>
              <td className="px-5 py-4 text-right whitespace-nowrap font-bold text-[var(--color-text-primary)]">
                ₹{totalPrice.toFixed(2)}
              </td>
              <td className="px-5 py-4 text-right whitespace-nowrap font-bold text-[var(--color-text-secondary)]">
                ₹{totalGst.toFixed(2)}
              </td>
              <td className="px-5 py-4 text-right whitespace-nowrap font-bold text-[var(--color-accent)]">
                ₹{totalAmount.toFixed(2)}
              </td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>

      {/* Product Selector */}
      <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 border-t border-[var(--color-bg-tertiary)]">
        <label className="text-sm font-semibold text-[var(--color-text-secondary)] whitespace-nowrap">Select Product</label>

        <div className="flex-1 relative" ref={productRef}>
          <button
            type="button"
            onClick={() => setProductOpen((prev) => !prev)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg text-sm transition-colors hover:border-[var(--color-accent)] focus:outline-none focus:border-[var(--color-accent)] cursor-pointer"
          >
            <span className={selectedProduct ? 'text-[var(--color-text-primary)] font-medium' : 'text-[var(--color-text-secondary)]'}>
              {selectedProduct
                ? `${selectedProduct.name} – ₹${selectedProduct.professional}`
                : 'Select a product...'}
            </span>
            <ChevronDown
              size={15}
              className={`text-[var(--color-text-secondary)] shrink-0 transition-transform ${productOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {productOpen && (
            <div className="absolute z-50 bottom-full left-0 right-0 mb-1 bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl shadow-2xl overflow-hidden">
              <div className="p-2 border-b border-[var(--color-bg-tertiary)]">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-8 pr-4 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                  />
                </div>
              </div>
              <ul className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--color-bg-tertiary)]">
                {filteredProducts.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-[var(--color-text-secondary)] text-center">No products found</li>
                ) : (
                  filteredProducts.map((p) => (
                    <li
                      key={p.id}
                      onClick={() => { setSelectedProduct(p); setProductOpen(false); setProductSearch('') }}
                      className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-[var(--color-bg-tertiary)] transition-colors flex justify-between items-center ${selectedProduct?.id === p.id ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'text-[var(--color-text-primary)]'
                        }`}
                    >
                      <span className="font-medium">{p.name}</span>
                      <span className="text-xs text-[var(--color-text-secondary)] ml-4 whitespace-nowrap">₹{p.professional}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddProduct}
          disabled={!selectedProduct}
          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-accent)] hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shadow-sm"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>
    </div>
  )
}

export default InvoiceItemsSection
