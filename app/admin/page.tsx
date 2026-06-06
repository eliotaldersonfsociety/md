"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, RefreshCw, Edit2, X, Check, ShoppingCart, Package, Eye, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  adminLogin,
  adminLogout,
  adminGetProducts,
  adminUpdateProduct,
  adminToggleProductActive,
  adminDeleteProduct,
  adminGetOrders,
  adminUpdateOrderStatus,
  adminUpdateVariant,
  adminSetVariantOferta,
} from "@/db/actions"

interface Product {
  id: number
  name: string
  price: number
  wholesale_price: number
  original_price?: number
  stock: number
  image: string
  category?: string
  is_new: boolean
  is_sale: boolean
  badge?: string
  badge_color?: string
  variants?: VariantWithType[]
  adult_variants?: VariantBase[]
  child_variants?: VariantBase[]
}

interface EditingProduct {
  id: number
  price?: number
  wholesale_price?: number
  original_price?: number | null
  stock?: number
  is_new?: boolean
  is_sale?: boolean
  badge?: string
  badge_color?: string
}

interface VariantBase {
   id: number
   label: string
   price: number
   wholesale_price: number
   stock: number
   badge?: string
   badge_color?: string
   is_active?: boolean
   of_active?: boolean
   of_price?: number
   of_wholesale_price?: number
   of_original_price?: number
   of_badge?: string
   of_badge_color?: string
 }

interface VariantWithType extends VariantBase {
  variant_type?: string
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
   const [editingId, setEditingId] = useState<number | null>(null)
   const [editForm, setEditForm] = useState<EditingProduct | null>(null)
   const [editingVariantId, setEditingVariantId] = useState<number | null>(null)
const [editVariantForm, setEditVariantForm] = useState<{
       id?: number;
       price?: number;
       wholesale_price?: number;
       stock?: number;
       badge?: string;
       badge_color?: string;
       active?: boolean;
       of_active?: boolean;
       of_price?: number;
       of_wholesale_price?: number;
       of_original_price?: number;
       of_stock?: number;
       of_badge?: string;
       of_badge_color?: string;
     } | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
const [editedVariantBadges, setEditedVariantBadges] = useState<Record<number, { text: string; color: string }>>({})
   const [editedVariantOfertas, setEditedVariantOfertas] = useState<Record<number, { price?: number; originalPrice?: number; active?: boolean }>>({})
   const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [usernameInput, setUsernameInput] = useState("")
  const [passwordInput, setPasswordInput] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("products")

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))]

  useEffect(() => {
    adminGetProducts().then((result) => {
      const r = result as any
      if (r.products) {
        setProducts(r.products)
        setIsAuthenticated(true)
      }
    }).catch(() => {})
  }, [])

  const handleLogin = async () => {
    setLoginLoading(true)
    try {
      const result: any = await adminLogin(passwordInput, usernameInput)
      if (result.success) {
        setIsAuthenticated(true)
        toast.success("Acceso concedido")
      } else {
        toast.error(result.error || "Error de acceso")
      }
    } catch (error) {
      toast.error("Error de autenticación")
      console.error(error)
    } finally {
      setLoginLoading(false)
    }
    setPasswordInput("")
    setUsernameInput("")
  }

  const handleLogout = async () => {
    await adminLogout()
    setIsAuthenticated(false)
    setProducts([])
    setOrders([])
    toast.success("Sesion cerrada")
  }

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const result: any = await adminGetProducts()
      if (result.products) {
        setProducts(result.products)
      } else {
        toast.error(result.error || "Error al cargar productos")
      }
    } catch (error) {
      toast.error("Error al cargar productos")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true)
    try {
      const result: any = await adminGetOrders()
      if (result.orders) {
        setOrders(result.orders)
      } else {
        toast.error(result.error || "Error al cargar ordenes")
      }
    } catch (error) {
      toast.error("Error al cargar ordenes")
      console.error(error)
    } finally {
      setOrdersLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts()
      fetchOrders()
    }
  }, [isAuthenticated, fetchProducts, fetchOrders])

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setEditForm({
      id: product.id,
      price: product.price,
      wholesale_price: product.wholesale_price,
      original_price: product.original_price || null,
      stock: product.stock,
      is_new: product.is_new,
      is_sale: product.is_sale,
      badge: product.badge || "",
      badge_color: product.badge_color || ""
    })
  }

        const handleSave = async () => {
      toast.info("handleSave called")
      if (!editForm) {
        toast.error("editForm is null")
        return
      }
      try {
        const result = await adminUpdateProduct({
          id: editForm.id,
          price: editForm.price!,
          wholesalePrice: editForm.wholesale_price!,
          originalPrice: editForm.original_price ?? undefined,
          stock: editForm.stock!,
          isNew: editForm.is_new!,
          isSale: editForm.is_sale!,
          badge: editForm.badge,
          badgeColor: editForm.badge_color
        })
        if (result.success) {
          toast.success("Producto actualizado")
          setEditingId(null)
          setEditForm(null)
          fetchProducts()
        } else {
          toast.error(result.error || "Error al guardar")
        }
      } catch (error) {
        toast.error("Error al guardar")
        console.error(error)
      }
    }

   const handleSaveVariant = async () => {
     toast.info("handleSaveVariant called")
     if (!editVariantForm) {
       toast.error("editVariantForm is null")
       return
     }
      try {
        const result: any = await adminUpdateVariant({
          id: editVariantForm.id!,
          price: editVariantForm.price ?? 0,
          wholesalePrice: editVariantForm.wholesale_price ?? 0,
          stock: editVariantForm.stock ?? 0,
          badge: editVariantForm.badge,
          badgeColor: editVariantForm.badge_color,
          active: editVariantForm.active,
          of_active: editVariantForm.of_active,
          of_price: editVariantForm.of_price,
          of_wholesale_price: editVariantForm.of_wholesale_price,
          of_original_price: editVariantForm.of_original_price,
          of_stock: editVariantForm.of_stock,
          of_badge: editVariantForm.of_badge,
          of_badge_color: editVariantForm.of_badge_color,
        })
        if (result.success) {
         toast.success("Variante actualizada")
         setEditingVariantId(null)
         setEditVariantForm(null)
         fetchProducts()
       } else {
         toast.error(result.error || "Error al guardar variante")
       }
     } catch (error) {
       toast.error("Error al guardar variante")
       console.error(error)
     }
   }

  const handleToggleVariantActive = async (variantId: number, currentActive: boolean) => {
    try {
      const result: any = await adminUpdateVariant({ id: variantId, active: !currentActive })
      if (result.success) {
        toast.success(!currentActive ? "Variante activada" : "Variante desactivada")
        fetchProducts()
      } else {
        toast.error("Error al cambiar estado")
      }
    } catch (error) {
      toast.error("Error al cambiar estado")
      console.error(error)
    }
  }

  const handleDelete = async (productId: number) => {
    if (!confirm("Estas seguro de eliminar este producto?")) return
    try {
      const result: any = await adminDeleteProduct(productId)
      if (result.success) {
        toast.success("Producto eliminado")
        fetchProducts()
      } else {
        toast.error("Error al eliminar")
      }
    } catch (error) {
      toast.error("Error al eliminar")
      console.error(error)
    }
  }

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      const result: any = await adminUpdateOrderStatus(orderId, status)
      if (result.success) {
        toast.success("Estado actualizado")
        fetchOrders()
      } else {
        toast.error("Error al actualizar estado")
      }
    } catch (error) {
      toast.error("Error al actualizar estado")
      console.error(error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      pending: { label: "Pendiente", className: "bg-yellow-500" },
      processing: { label: "Procesando", className: "bg-blue-500" },
      completed: { label: "Completado", className: "bg-green-500" },
      cancelled: { label: "Cancelado", className: "bg-red-500" }
    }
    const s = statusMap[status] || { label: status, className: "bg-gray-500" }
    return <Badge className={s.className}>{s.label}</Badge>
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredOrders = orders.filter(o => {
    const q = searchQuery.toLowerCase()
    return o.order_number.toLowerCase().includes(q) ||
           o.email.toLowerCase().includes(q) ||
           o.phone.toLowerCase().includes(q)
  })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Panel de Administracion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Usuario"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                autoComplete="username"
              />
              <Input
                type="password"
                placeholder="Contraseña"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                autoComplete="current-password"
              />
              <Button onClick={handleLogin} className="w-full" disabled={loginLoading}>
                {loginLoading ? "Ingresando..." : "Ingresar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Gestiona productos y ordenes</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => { fetchProducts(); fetchOrders(); }} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
            <Button onClick={handleLogout} variant="ghost" size="sm">
              Cerrar sesión
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              Productos
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Compras / Ordenes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.filter((c): c is string => c !== "all" && c !== undefined).map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead className="w-12">ID</TableHead>
                       <TableHead>Producto</TableHead>
                       <TableHead>Categoria</TableHead>
                       <TableHead className="text-right">Precio</TableHead>
                       <TableHead className="text-right">Precio Mayor</TableHead>
                       <TableHead className="text-right">Precio Orig.</TableHead>
                       <TableHead className="text-right">Stock</TableHead>
                       <TableHead>Badges</TableHead>
                       <TableHead className="text-center">Activa</TableHead>
                       <TableHead className="text-right">Acciones</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {loading ? (
                       <TableRow>
                         <TableCell colSpan={10} className="text-center py-8">Cargando productos...</TableCell>
                      </TableRow>
                    ) : filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No se encontraron productos</TableCell>
                      </TableRow>
                    ) : (
                       filteredProducts.flatMap((product) => {
                    const rows = [];
                    
                    // Fila principal del producto
                    rows.push(
                      <TableRow key={`${product.id}-main`}>
                        <TableCell className="font-mono text-sm">{product.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-medium truncate max-w-[200px]">{product.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category || "—"}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {editingId === product.id ? (
                            <Input type="number" value={editForm?.price || 0} onChange={(e) => setEditForm(prev => prev ? { ...prev, price: Number(e.target.value) } : prev)} className="w-24 text-right" />
                          ) : (
                            `$${product.price.toLocaleString("es-CO")}`
                          )}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {editingId === product.id ? (
                            <Input type="number" value={editForm?.wholesale_price || 0} onChange={(e) => setEditForm(prev => prev ? { ...prev, wholesale_price: Number(e.target.value) } : prev)} className="w-24 text-right" />
                          ) : (
                            `$${product.wholesale_price.toLocaleString("es-CO")}`
                          )}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {editingId === product.id ? (
                            <Input type="number" value={editForm?.original_price ?? ''} onChange={(e) => setEditForm(prev => prev ? { ...prev, original_price: e.target.value === '' ? null : Number(e.target.value) } : prev)} className="w-24 text-right" placeholder="—" />
                          ) : (
                            product.original_price ? `$${product.original_price.toLocaleString("es-CO")}` : "—"
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {editingId === product.id ? (
<Input type="number" value={editForm?.stock || 0} onChange={(e) => setEditForm(prev => prev ? { ...prev, stock: Number(e.target.value) } : prev)} className="w-20 text-right" />
                           ) : (
                             <span className={cn("font-mono", product.stock <= 10 && "text-red-500 font-bold")}>{product.stock}</span>
                           )}
                         </TableCell>
                         <TableCell>
                           {editingId === product.id ? (
                             <div className="flex flex-col gap-1">
                               <div className="flex items-center gap-2">
                                  <Switch checked={editForm?.is_new} onCheckedChange={(checked) => setEditForm(prev => prev ? { ...prev, is_new: checked } : prev)} />
                                 <span className="text-xs">Nuevo</span>
                               </div>
                               <div className="flex items-center gap-2">
                                  <Switch checked={editForm?.is_sale} onCheckedChange={(checked) => setEditForm(prev => prev ? { ...prev, is_sale: checked } : prev)} />
                                 <span className="text-xs">Oferta</span>
                               </div>
                                <Input placeholder="Badge text" value={editForm?.badge || ""} onChange={(e) => setEditForm(prev => prev ? { ...prev, badge: e.target.value } : prev)} className="h-7 text-xs" />
                                <Input placeholder="Badge color (bg-green-500)" value={editForm?.badge_color || ""} onChange={(e) => setEditForm(prev => prev ? { ...prev, badge_color: e.target.value } : prev)} className="h-7 text-xs" />
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {product.is_new && <Badge className="bg-green-500">Nuevo</Badge>}
                              {product.is_sale && <Badge className="bg-red-500">Oferta</Badge>}
                              {product.badge && !product.is_new && !product.is_sale && (
                                <Badge className={product.badge_color || "bg-gray-500"}>{product.badge}</Badge>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={(product as any).is_active ?? true}
                            onCheckedChange={async (checked) => {
                              await adminToggleProductActive(product.id, checked)
                              fetchProducts()
                            }}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          {editingId === product.id ? (
                            <div className="flex justify-end gap-1">
                              <Button onClick={handleSave} size="icon" variant="default" className="h-8 w-8"><Check className="h-4 w-4" /></Button>
                              <Button onClick={() => { setEditingId(null); setEditForm(null); }} size="icon" variant="ghost" className="h-8 w-8"><X className="h-4 w-4" /></Button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-1">
                              <Button onClick={() => handleEdit(product)} size="icon" variant="ghost" className="h-8 w-8"><Edit2 className="h-4 w-4" /></Button>
                              <Button onClick={() => handleDelete(product.id)} size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600"><X className="h-4 w-4" /></Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );

                    // Filas de variantes (si existen) - deduplicate by label
                    const allVariants = [...(product.variants || []), ...(product.adult_variants || []), ...(product.child_variants || [])]
                    const seenVariantLabels = new Set()
                    const variantsToShow = allVariants.filter(v => {
                      if (seenVariantLabels.has(v.label)) return false
                      seenVariantLabels.add(v.label)
                      return true
                    })
                    variantsToShow.forEach((variant, index) => {
                      // Determinar el tipo de variante para mostrarlo apropiadamente
                      const variantType = product.adult_variants?.some(v => v.label === variant.label) ? 'adult' : 
                                        product.child_variants?.some(v => v.label === variant.label) ? 'child' : 
                                        'standard';
                                                    
                      rows.push(
                        <TableRow key={`${product.id}-variant-${variant.label}`} className="bg-muted/50">
                          <TableCell className="font-mono text-sm text-muted-foreground">{product.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3 pl-4">
                              <div className="w-10 h-10 rounded-md overflow-hidden bg-muted/50 flex-shrink-0">
                                <img src={product.image} alt={`${product.name} - ${variant.label}`} className="w-full h-full object-cover" />
                              </div>
                              <span className="font-medium truncate max-w-[200px] text-muted-foreground">
                                {variant.label} {variantType === 'adult' && '(Adulto)'} 
                                {variantType === 'child' && '(Niño)'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.category || "—"}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono text-muted-foreground">
{editingVariantId === variant.id ? (
                               <Input type="number" value={editVariantForm?.price || variant.price} onChange={(e) => setEditVariantForm(prev => ({ ...prev, price: Number(e.target.value) } as any))} className="w-24 text-right" />
                             ) : (
                               `${variant.price.toLocaleString("es-CO")}`
                             )}
                           </TableCell>
                           <TableCell className="text-right font-mono text-muted-foreground">
                             {editingVariantId === variant.id ? (
                               <Input type="number" value={editVariantForm?.wholesale_price || variant.wholesale_price} onChange={(e) => setEditVariantForm(prev => ({ ...prev, wholesale_price: Number(e.target.value) } as any))} className="w-24 text-right" />
                             ) : (
                               `${variant.wholesale_price.toLocaleString("es-CO")}`
                             )}
                           </TableCell>
                           <TableCell className="text-right font-mono text-muted-foreground">
                             —
                           </TableCell>
                            <TableCell className="text-right">
                              {editingVariantId === variant.id ? (
                                <Input type="number" value={editVariantForm?.stock || variant.stock} onChange={(e) => setEditVariantForm(prev => ({ ...prev, stock: Number(e.target.value) } as any))} className="w-20 text-right" />
                             ) : (
                               <div className="flex flex-col items-end">
                                 <span className={cn("font-mono", (variant.stock || 0) <= 10 && "text-red-500 font-bold text-muted-foreground")}>
                                   {variant.stock}
                                 </span>
                                 {(variant as any).of_active && (variant as any).of_stock !== undefined && (variant as any).of_stock !== null && (
                                   <span className="text-xs text-primary font-medium">
                                     Oferta: {(variant as any).of_stock}
                                   </span>
                                 )}
                               </div>
                             )}
                           </TableCell>
<TableCell>
                              {editingVariantId === variant.id ? (
                                <div className="flex flex-col gap-1">
                                  <Input placeholder="Badge texto" value={editVariantForm?.badge ?? variant.badge ?? ''} onChange={(e) => setEditVariantForm(prev => prev ? { ...prev, badge: e.target.value } : null)} className="h-7 text-xs w-24" />
                                  <Input placeholder="Color (ej: bg-red-500)" value={editVariantForm?.badge_color ?? variant.badge_color ?? ''} onChange={(e) => setEditVariantForm(prev => prev ? { ...prev, badge_color: e.target.value } : null)} className="h-7 text-xs w-24" />
                <div className="flex items-center gap-2 mt-1">
                  <Switch
                    checked={editVariantForm?.active ?? variant.is_active ?? true}
                    onCheckedChange={(checked) => setEditVariantForm(prev => prev ? { ...prev, active: checked } : prev)}
                  />
                  <span className="text-xs">Activa</span>
                </div>
                {/* Oferta controls for variants */}
                <div className="border-t pt-2 mt-2">
                  <span className="text-xs font-semibold text-primary">Oferta:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Switch
                      checked={editVariantForm?.of_active ?? (variant as any).of_active ?? false}
                      onCheckedChange={(checked) => setEditVariantForm(prev => prev ? { ...prev, of_active: checked } : prev)}
                    />
                    <span className="text-xs">Activar oferta</span>
                  </div>
                   {(editVariantForm?.of_active ?? (variant as any).of_active ?? false) && (
                     <div className="flex flex-col gap-1 mt-1">
                       <Input 
                         type="number" 
                         placeholder="Precio oferta" 
                         value={editVariantForm?.of_price ?? (variant as any).of_price ?? ''} 
                         onChange={(e) => setEditVariantForm(prev => prev ? { ...prev, of_price: Number(e.target.value) } : null)} 
                         className="h-7 text-xs w-24" 
                       />
                       <Input 
                         type="number" 
                         placeholder="Precio orig." 
                         value={editVariantForm?.of_original_price ?? (variant as any).of_original_price ?? ''} 
                         onChange={(e) => setEditVariantForm(prev => prev ? { ...prev, of_original_price: Number(e.target.value) } : null)} 
                         className="h-7 text-xs w-24" 
                       />
                       <Input 
                         type="number"
                         placeholder="Stock oferta"
                         value={editVariantForm?.of_stock ?? (variant as any).of_stock ?? ''}
                         onChange={(e) => setEditVariantForm(prev => prev ? { ...prev, of_stock: Number(e.target.value) } : null)}
                         className="h-7 text-xs w-24"
                       />
                       <Input 
                         placeholder="Badge oferta" 
                         value={editVariantForm?.of_badge ?? (variant as any).of_badge ?? 'OFERTA'} 
                         onChange={(e) => setEditVariantForm(prev => prev ? { ...prev, of_badge: e.target.value } : null)} 
                         className="h-7 text-xs w-24" 
                       />
                       <Input 
                         placeholder="Color (bg-red-500)" 
                         value={editVariantForm?.of_badge_color ?? (variant as any).of_badge_color ?? 'bg-red-500'} 
                         onChange={(e) => setEditVariantForm(prev => prev ? { ...prev, of_badge_color: e.target.value } : null)} 
                         className="h-7 text-xs w-24" 
                       />
                     </div>
                   )}
                </div>
                               </div>
                              ) : (
                                <div className="flex flex-col gap-1">
                                  <div className="flex flex-wrap gap-1 text-xs">
                                    {variant.stock <= 10 && <Badge className="bg-red-500 text-white">Stock Bajo</Badge>}
                                    {variant.badge && <Badge className={variant.badge_color || "bg-gray-500"}>{variant.badge}</Badge>}
                                    {(variant as any).of_active && <Badge className="bg-red-500 text-white">OFERTA</Badge>}
                                  </div>
                <div className="flex items-center gap-2 mt-1">
                  <Switch
                    checked={variant.is_active ?? true}
                    onCheckedChange={(checked) => handleToggleVariantActive(variant.id, variant.is_active ?? true)}
                  />
                  <span className="text-xs">Activa</span>
                </div>
<div className="flex items-center gap-2 mt-1">
                    <Switch
                      checked={(variant as any).of_active ?? false}
                      onCheckedChange={async (checked) => {
                        await adminSetVariantOferta(variant.id, { active: checked })
                        fetchProducts()
                      }}
                    />
                    <span className="text-xs">En oferta</span>
                  </div>
                                </div>
                              )}
                            </TableCell>
                           <TableCell className="text-right">
                             {editingVariantId === variant.id ? (
                               <div className="flex justify-end gap-1">
                                 <Button onClick={handleSaveVariant} size="icon" variant="default" className="h-8 w-8"><Check className="h-4 w-4" /></Button>
                                 <Button onClick={() => { setEditingVariantId(null); setEditVariantForm(null); }} size="icon" variant="ghost" className="h-8 w-8"><X className="h-4 w-4" /></Button>
                               </div>
                             ) : (
<Button onClick={() => {
                                  setEditingVariantId(variant.id);
                                  setEditVariantForm({ 
                                    id: variant.id, 
                                    price: variant.price, 
                                    wholesale_price: variant.wholesale_price, 
                                    stock: variant.stock, 
                                    badge: variant.badge, 
                                    badge_color: variant.badge_color, 
                                    active: variant.is_active ?? true,
                                    of_active: (variant as any).of_active ?? false,
                                    of_price: (variant as any).of_price,
                                    of_wholesale_price: (variant as any).of_wholesale_price,
                                    of_original_price: (variant as any).of_original_price,
                                    of_stock: (variant as any).of_stock,
                                    of_badge: (variant as any).of_badge ?? 'OFERTA',
                                    of_badge_color: (variant as any).of_badge_color ?? 'bg-red-500'
                                  });
                                }} size="icon" variant="ghost" className="h-8 w-8"><Edit2 className="h-4 w-4" /></Button>
                             )}
                           </TableCell>
                        </TableRow>
                      );
                    });
                    
                    return rows;
                  })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <div className="text-sm text-muted-foreground">Mostrando {filteredProducts.length} de {products.length} productos</div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ordenes de Compra</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N Orden</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Telefono</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordersLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">Cargando ordenes...</TableCell>
                      </TableRow>
                    ) : filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No hay ordenes registradas</TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono font-medium">{order.order_number}</TableCell>
                          <TableCell className="text-sm">
                            {new Date(order.created_at).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </TableCell>
                          <TableCell>
                            <Badge variant={order.mode === "wholesale" ? "default" : "secondary"}>
                              {order.mode === "wholesale" ? "Al Mayor" : "Al Detal"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">
                                {order.first_name && order.last_name ? `${order.first_name} ${order.last_name}` : order.business_name || order.email}
                              </p>
                              {order.business_name && <p className="text-xs text-muted-foreground">{order.business_name}</p>}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{order.phone}</TableCell>
                          <TableCell className="text-right font-mono font-medium">${order.total.toLocaleString("es-CO")}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell className="text-right">
                            <Dialog open={selectedOrder?.id === order.id} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                              <DialogTrigger asChild>
                                <Button onClick={() => setSelectedOrder(order)} size="icon" variant="ghost" className="h-8 w-8">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Detalle de Orden {order.order_number}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-muted-foreground">Cliente</p>
                                      <p className="font-medium">
                                        {order.first_name && order.last_name ? `${order.first_name} ${order.last_name}` : order.business_name || order.email}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Email</p>
                                      <p className="font-medium text-sm">{order.email}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Telefono</p>
                                      <p className="font-medium">{order.phone}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Metodo de Pago</p>
                                      <p className="font-medium capitalize">{order.payment_method}</p>
                                    </div>
                                    {order.nit && (
                                      <div>
                                        <p className="text-sm text-muted-foreground">NIT</p>
                                        <p className="font-medium">{order.nit}</p>
                                      </div>
                                    )}
                                    {order.address && (
                                      <div className="col-span-2">
                                        <p className="text-sm text-muted-foreground">Direccion</p>
                                        <p className="font-medium text-sm">
                                          {order.address}{order.apartment ? `, ${order.apartment}` : ""}{order.city ? `, ${order.city}` : ""}{order.department ? `, ${order.department}` : ""}
                                        </p>
                                      </div>
                                    )}
                                    {order.payment_reference && (
                                      <div>
                                        <p className="text-sm text-muted-foreground">Referencia</p>
                                        <p className="font-medium">{order.payment_reference}</p>
                                      </div>
                                    )}
                                    {order.payment_screenshot && (
                                      <div>
                                        <p className="text-sm text-muted-foreground">Comprobante</p>
                                        <img src={order.payment_screenshot} alt="Comprobante" className="w-32 h-32 object-cover rounded border" />
                                      </div>
                                    )}
                                    {order.notes && (
                                      <div className="col-span-2">
                                        <p className="text-sm text-muted-foreground">Notas</p>
                                        <p className="font-medium text-sm">{order.notes}</p>
                                      </div>
                                    )}
                                  </div>

                                  <div className="border-t pt-4">
                                    <h4 className="font-medium mb-2">Productos</h4>
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Producto</TableHead>
                                          <TableHead>Variante</TableHead>
                                          <TableHead className="text-right">Precio</TableHead>
                                          <TableHead className="text-right">Cant.</TableHead>
                                          <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {order.items?.map((item: any, idx: number) => (
                                          <TableRow key={idx}>
                                            <TableCell>{item.product_name}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{item.variant_label || "—"}</TableCell>
                                            <TableCell className="text-right font-mono">${item.product_price.toLocaleString("es-CO")}</TableCell>
                                            <TableCell className="text-right">{item.quantity}</TableCell>
                                            <TableCell className="text-right font-mono">${item.total.toLocaleString("es-CO")}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>

                                  <div className="border-t pt-4 space-y-1">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-muted-foreground">Subtotal</span>
                                      <span>${order.subtotal.toLocaleString("es-CO")}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-muted-foreground">Envio</span>
                                      <span>${order.shipping_cost?.toLocaleString("es-CO")}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg">
                                      <span>Total</span>
                                      <span>${order.total.toLocaleString("es-CO")}</span>
                                    </div>
                                  </div>

                                  <div className="border-t pt-4">
                                    <p className="text-sm text-muted-foreground mb-2">Cambiar estado:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {["pending", "processing", "completed", "cancelled"].map((status) => (
                                        <Button key={status} size="sm" variant={order.status === status ? "default" : "outline"} onClick={() => handleUpdateOrderStatus(order.id, status)}>
                                          {status === "pending" ? "Pendiente" : status === "processing" ? "Procesando" : status === "completed" ? "Completado" : "Cancelado"}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            {filteredOrders.length > 0 && (
              <p className="text-sm text-muted-foreground">Mostrando {filteredOrders.length} de {orders.length} ordenes</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
