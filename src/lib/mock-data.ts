import type {
  User,
  Table,
  MenuItem,
  Order,
  Reservation,
  InventoryItem,
  DashboardStats,
} from "@/types";

// ─── Stats ────────────────────────────────────────────────────────────────────
export const mockStats: DashboardStats = {
  revenue_today: 2650,
  revenue_week: 19150,
  revenue_month: 74800,
  tables_occupied: 8,
  tables_total: 15,
  orders_today: 34,
  reservations_today: 5,
  avg_ticket: 42,
  items_low_stock: 3,
};

// ─── Weekly Revenue ───────────────────────────────────────────────────────────
export const mockWeeklyRevenue = [
  { day: "Thu", revenue: 2150 },
  { day: "Fri", revenue: 3200 },
  { day: "Sat", revenue: 4100 },
  { day: "Sun", revenue: 3600 },
  { day: "Mon", revenue: 1850 },
  { day: "Tue", revenue: 2100 },
  { day: "Wed", revenue: 2150 },
];

// ─── Tables ───────────────────────────────────────────────────────────────────
export const mockTables: Table[] = [
  { id: "TBL-001", number: 1, capacity: 2, status: "livre", section: "Window" },
  { id: "TBL-002", number: 2, capacity: 2, status: "reservada", section: "Window", waiter_id: "USR-003", waiter_name: "Jake" },
  { id: "TBL-003", number: 3, capacity: 4, status: "ocupada", section: "Window", waiter_id: "USR-003", waiter_name: "Jake", opened_at: "2025-05-29T18:15:00" },
  { id: "TBL-004", number: 4, capacity: 2, status: "livre", section: "Window" },
  { id: "TBL-005", number: 5, capacity: 4, status: "ocupada", section: "Main Floor", waiter_id: "USR-003", waiter_name: "Jake", opened_at: "2025-05-29T18:30:00" },
  { id: "TBL-006", number: 6, capacity: 4, status: "livre", section: "Main Floor" },
  { id: "TBL-007", number: 7, capacity: 4, status: "ocupada", section: "Main Floor", waiter_id: "USR-004", waiter_name: "Sara", opened_at: "2025-05-29T18:00:00" },
  { id: "TBL-008", number: 8, capacity: 4, status: "reservada", section: "Main Floor", waiter_id: "USR-004", waiter_name: "Sara" },
  { id: "TBL-009", number: 9, capacity: 4, status: "ocupada", section: "Main Floor", waiter_id: "USR-004", waiter_name: "Sara", opened_at: "2025-05-29T17:45:00" },
  { id: "TBL-010", number: 10, capacity: 4, status: "limpeza", section: "Main Floor" },
  { id: "TBL-011", number: 11, capacity: 6, status: "ocupada", section: "Private", waiter_id: "USR-004", waiter_name: "Sara", opened_at: "2025-05-29T18:00:00" },
  { id: "TBL-012", number: 12, capacity: 6, status: "ocupada", section: "Private", waiter_id: "USR-003", waiter_name: "Jake", opened_at: "2025-05-29T18:45:00" },
  { id: "TBL-013", number: 13, capacity: 6, status: "livre", section: "Private" },
  { id: "TBL-014", number: 14, capacity: 6, status: "reservada", section: "Private" },
  { id: "TBL-015", number: 15, capacity: 6, status: "livre", section: "Private" },
];

// ─── Menu ─────────────────────────────────────────────────────────────────────
export const mockMenuItems: MenuItem[] = [
  // Appetizers
  { id: "MNU-001", name: "Bruschetta Classica", category: "entradas", price: 12, description: "Toasted bread, tomatoes, basil, olive oil", available: true, prep_time: 8, popular: true },
  { id: "MNU-002", name: "Caesar Salad", category: "entradas", price: 14, description: "Romaine lettuce, croutons, parmesan, caesar dressing", available: true, prep_time: 10 },
  { id: "MNU-003", name: "Calamari Fritti", category: "entradas", price: 16, description: "Golden fried calamari with marinara sauce", available: true, prep_time: 12, popular: true },
  { id: "MNU-004", name: "Soup of the Day", category: "entradas", price: 10, description: "Ask your waiter for today's special", available: true, prep_time: 5 },
  // Mains
  { id: "MNU-005", name: "Grilled Salmon", category: "pratos_principais", price: 32, description: "Atlantic salmon, lemon butter sauce, seasonal vegetables", available: true, prep_time: 18, popular: true },
  { id: "MNU-006", name: "Ribeye Steak 12oz", category: "pratos_principais", price: 48, description: "Prime USDA ribeye, herb butter, truffle fries", available: true, prep_time: 20, popular: true },
  { id: "MNU-007", name: "Chicken Parmigiana", category: "pratos_principais", price: 26, description: "Breaded chicken, mozzarella, tomato sauce, spaghetti", available: true, prep_time: 15 },
  { id: "MNU-008", name: "Pasta Carbonara", category: "pratos_principais", price: 22, description: "Spaghetti, guanciale, egg yolk, pecorino, black pepper", available: true, prep_time: 12 },
  { id: "MNU-009", name: "Mushroom Risotto", category: "pratos_principais", price: 24, description: "Arborio rice, porcini mushrooms, parmesan, truffle oil", available: true, prep_time: 22 },
  { id: "MNU-010", name: "Margherita Pizza", category: "pratos_principais", price: 18, description: "San Marzano tomatoes, fresh mozzarella, basil", available: true, prep_time: 14 },
  // Desserts
  { id: "MNU-011", name: "Tiramisu", category: "sobremesas", price: 10, description: "Mascarpone cream, ladyfingers, espresso, cocoa", available: true, prep_time: 5, popular: true },
  { id: "MNU-012", name: "New York Cheesecake", category: "sobremesas", price: 9, description: "Classic cheesecake with berry compote", available: true, prep_time: 5 },
  { id: "MNU-013", name: "Chocolate Lava Cake", category: "sobremesas", price: 11, description: "Warm chocolate cake with vanilla ice cream", available: true, prep_time: 12, popular: true },
  { id: "MNU-014", name: "Panna Cotta", category: "sobremesas", price: 8, description: "Vanilla cream with strawberry coulis", available: true, prep_time: 5 },
  // Drinks
  { id: "MNU-015", name: "Still Water", category: "bebidas", price: 4, description: "500ml still water", available: true, prep_time: 1 },
  { id: "MNU-016", name: "Sparkling Water", category: "bebidas", price: 5, description: "500ml sparkling water", available: true, prep_time: 1 },
  { id: "MNU-017", name: "Fresh Juice", category: "bebidas", price: 8, description: "Orange, apple, or pineapple — ask your waiter", available: true, prep_time: 5 },
  { id: "MNU-018", name: "House Wine (glass)", category: "bebidas", price: 12, description: "Red, white, or rosé — by the glass", available: true, prep_time: 2, popular: true },
  { id: "MNU-019", name: "Craft Beer", category: "bebidas", price: 9, description: "Local IPA, lager, or stout — rotating selection", available: true, prep_time: 2 },
  { id: "MNU-020", name: "Espresso", category: "bebidas", price: 4, description: "Double shot espresso", available: true, prep_time: 3 },
  { id: "MNU-021", name: "Cappuccino", category: "bebidas", price: 6, description: "Espresso with steamed milk foam", available: true, prep_time: 4 },
  { id: "MNU-022", name: "Soda", category: "bebidas", price: 4, description: "Coke, Diet Coke, Sprite, Ginger Ale", available: true, prep_time: 1 },
];

// ─── Orders ───────────────────────────────────────────────────────────────────
export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    table_id: "TBL-003",
    table_number: 3,
    guests: 2,
    items: [
      { menu_item_id: "MNU-002", name: "Caesar Salad", quantity: 2, price: 14 },
      { menu_item_id: "MNU-005", name: "Grilled Salmon", quantity: 2, price: 32 },
      { menu_item_id: "MNU-015", name: "Still Water", quantity: 2, price: 4 },
    ],
    status: "preparando",
    total: 100,
    waiter_id: "USR-003",
    waiter_name: "Jake",
    created_at: "2025-05-29T18:15:00",
    updated_at: "2025-05-29T18:20:00",
  },
  {
    id: "ORD-002",
    table_id: "TBL-007",
    table_number: 7,
    guests: 4,
    items: [
      { menu_item_id: "MNU-004", name: "Soup of the Day", quantity: 4, price: 10 },
      { menu_item_id: "MNU-006", name: "Ribeye Steak 12oz", quantity: 2, price: 48 },
      { menu_item_id: "MNU-007", name: "Chicken Parmigiana", quantity: 2, price: 26 },
      { menu_item_id: "MNU-018", name: "House Wine (glass)", quantity: 3, price: 12 },
    ],
    status: "pendente",
    total: 228,
    waiter_id: "USR-004",
    waiter_name: "Sara",
    created_at: "2025-05-29T18:00:00",
    updated_at: "2025-05-29T18:00:00",
  },
  {
    id: "ORD-003",
    table_id: "TBL-009",
    table_number: 9,
    guests: 3,
    items: [
      { menu_item_id: "MNU-001", name: "Bruschetta Classica", quantity: 3, price: 12 },
      { menu_item_id: "MNU-006", name: "Ribeye Steak 12oz", quantity: 1, price: 48 },
      { menu_item_id: "MNU-008", name: "Pasta Carbonara", quantity: 2, price: 22 },
      { menu_item_id: "MNU-019", name: "Craft Beer", quantity: 2, price: 9 },
      { menu_item_id: "MNU-011", name: "Tiramisu", quantity: 1, price: 10 },
    ],
    status: "entregue",
    total: 148,
    waiter_id: "USR-004",
    waiter_name: "Sara",
    created_at: "2025-05-29T17:45:00",
    updated_at: "2025-05-29T18:25:00",
    payment_method: undefined,
  },
  {
    id: "ORD-004",
    table_id: "TBL-012",
    table_number: 12,
    guests: 5,
    items: [
      { menu_item_id: "MNU-003", name: "Calamari Fritti", quantity: 2, price: 16 },
      { menu_item_id: "MNU-001", name: "Bruschetta Classica", quantity: 2, price: 12 },
      { menu_item_id: "MNU-015", name: "Still Water", quantity: 5, price: 4 },
    ],
    status: "pendente",
    total: 76,
    waiter_id: "USR-003",
    waiter_name: "Jake",
    created_at: "2025-05-29T18:45:00",
    updated_at: "2025-05-29T18:45:00",
  },
  {
    id: "ORD-005",
    table_id: "TBL-005",
    table_number: 5,
    guests: 2,
    items: [
      { menu_item_id: "MNU-011", name: "Tiramisu", quantity: 2, price: 10 },
      { menu_item_id: "MNU-021", name: "Cappuccino", quantity: 2, price: 6 },
    ],
    status: "pronto",
    total: 32,
    waiter_id: "USR-003",
    waiter_name: "Jake",
    created_at: "2025-05-29T18:30:00",
    updated_at: "2025-05-29T18:50:00",
  },
  {
    id: "ORD-006",
    table_id: "TBL-011",
    table_number: 11,
    guests: 6,
    items: [
      { menu_item_id: "MNU-002", name: "Caesar Salad", quantity: 3, price: 14 },
      { menu_item_id: "MNU-003", name: "Calamari Fritti", quantity: 2, price: 16 },
      { menu_item_id: "MNU-009", name: "Mushroom Risotto", quantity: 2, price: 24 },
      { menu_item_id: "MNU-010", name: "Margherita Pizza", quantity: 2, price: 18 },
      { menu_item_id: "MNU-005", name: "Grilled Salmon", quantity: 2, price: 32 },
      { menu_item_id: "MNU-018", name: "House Wine (glass)", quantity: 6, price: 12 },
    ],
    status: "preparando",
    total: 302,
    waiter_id: "USR-004",
    waiter_name: "Sara",
    created_at: "2025-05-29T18:00:00",
    updated_at: "2025-05-29T18:10:00",
  },
  // Paid orders (history)
  {
    id: "ORD-007",
    table_id: "TBL-001",
    table_number: 1,
    guests: 2,
    items: [
      { menu_item_id: "MNU-010", name: "Margherita Pizza", quantity: 1, price: 18 },
      { menu_item_id: "MNU-019", name: "Craft Beer", quantity: 2, price: 9 },
    ],
    status: "pago",
    total: 36,
    waiter_id: "USR-003",
    waiter_name: "Jake",
    created_at: "2025-05-29T16:30:00",
    updated_at: "2025-05-29T17:45:00",
    payment_method: "cartao",
  },
  {
    id: "ORD-008",
    table_id: "TBL-006",
    table_number: 6,
    guests: 3,
    items: [
      { menu_item_id: "MNU-007", name: "Chicken Parmigiana", quantity: 2, price: 26 },
      { menu_item_id: "MNU-008", name: "Pasta Carbonara", quantity: 1, price: 22 },
      { menu_item_id: "MNU-022", name: "Soda", quantity: 3, price: 4 },
    ],
    status: "pago",
    total: 98,
    waiter_id: "USR-004",
    waiter_name: "Sara",
    created_at: "2025-05-29T17:00:00",
    updated_at: "2025-05-29T18:20:00",
    payment_method: "pix",
  },
];

// ─── Reservations ─────────────────────────────────────────────────────────────
export const mockReservations: Reservation[] = [
  { id: "RES-001", client_name: "Johnson Family", phone: "+1 (555) 100-0001", date: "2025-05-29", time: "18:00", guests: 2, table_id: "TBL-002", table_number: 2, status: "chegou" },
  { id: "RES-002", client_name: "Williams Party", phone: "+1 (555) 100-0002", date: "2025-05-29", time: "19:00", guests: 4, table_id: "TBL-008", table_number: 8, status: "confirmada" },
  { id: "RES-003", client_name: "Martinez Group", phone: "+1 (555) 100-0003", date: "2025-05-29", time: "19:30", guests: 6, table_id: "TBL-014", table_number: 14, status: "confirmada" },
  { id: "RES-004", client_name: "Chen & Chen", phone: "+1 (555) 100-0004", date: "2025-05-29", time: "20:00", guests: 4, status: "pendente" },
  { id: "RES-005", client_name: "Thompson Couple", phone: "+1 (555) 100-0005", date: "2025-05-29", time: "21:00", guests: 2, status: "confirmada" },
];

// ─── Inventory ────────────────────────────────────────────────────────────────
export const mockInventory: InventoryItem[] = [
  { id: "INV-001", name: "Salmon fillet", quantity: 8, unit: "portions", min_quantity: 5, category: "Proteins", last_updated: "2025-05-29" },
  { id: "INV-002", name: "Ribeye steak", quantity: 3, unit: "portions", min_quantity: 5, category: "Proteins", last_updated: "2025-05-29" },
  { id: "INV-003", name: "Chicken breast", quantity: 14, unit: "portions", min_quantity: 8, category: "Proteins", last_updated: "2025-05-29" },
  { id: "INV-004", name: "Spaghetti", quantity: 1.8, unit: "kg", min_quantity: 3, category: "Dry Goods", last_updated: "2025-05-29" },
  { id: "INV-005", name: "Arborio rice", quantity: 4, unit: "kg", min_quantity: 2, category: "Dry Goods", last_updated: "2025-05-29" },
  { id: "INV-006", name: "Fresh mozzarella", quantity: 0.9, unit: "kg", min_quantity: 2, category: "Dairy", last_updated: "2025-05-29" },
  { id: "INV-007", name: "Tomatoes", quantity: 6, unit: "kg", min_quantity: 3, category: "Produce", last_updated: "2025-05-29" },
  { id: "INV-008", name: "Heavy cream", quantity: 3, unit: "L", min_quantity: 2, category: "Dairy", last_updated: "2025-05-29" },
  { id: "INV-009", name: "House Red Wine", quantity: 8, unit: "bottles", min_quantity: 4, category: "Beverages", last_updated: "2025-05-29" },
  { id: "INV-010", name: "Craft Beer", quantity: 24, unit: "cans", min_quantity: 12, category: "Beverages", last_updated: "2025-05-29" },
  { id: "INV-011", name: "Coffee beans", quantity: 1.2, unit: "kg", min_quantity: 2, category: "Beverages", last_updated: "2025-05-29" },
  { id: "INV-012", name: "All-purpose flour", quantity: 9, unit: "kg", min_quantity: 5, category: "Dry Goods", last_updated: "2025-05-29" },
];

// ─── Staff (Users) ────────────────────────────────────────────────────────────
export const mockUsers: User[] = [
  { id: "USR-001", name: "Marcus Rivera", email: "admin@goldenfork.com", role: "admin", created_at: "2023-01-01", active: true },
  { id: "USR-002", name: "Sofia Chen", email: "gerente@goldenfork.com", role: "gerente", created_at: "2023-03-15", active: true },
  { id: "USR-003", name: "Jake Morrison", email: "garcom@goldenfork.com", role: "garcom", created_at: "2023-06-01", active: true },
  { id: "USR-004", name: "Sara Oliveira", email: "sara@goldenfork.com", role: "garcom", created_at: "2023-09-10", active: true },
  { id: "USR-005", name: "Chef Marco Vitale", email: "cozinha@goldenfork.com", role: "cozinha", created_at: "2023-01-15", active: true },
  { id: "USR-006", name: "Emma Walsh", email: "caixa@goldenfork.com", role: "caixa", created_at: "2024-01-20", active: true },
  { id: "USR-007", name: "Table 5 Guest", email: "mesa5@goldenfork.com", role: "cliente", created_at: "2025-05-29", active: true, table_id: "TBL-005" },
];
