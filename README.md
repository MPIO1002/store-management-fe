# Green Store - Store Management System

A modern, full-featured store management system built with Next.js, designed for efficient retail operations including inventory management, point-of-sale, customer management, and order tracking.

## 🚀 Technologies

### Core Framework
- **Next.js 14+** with App Router - Modern React framework with server-side rendering and optimized routing
- **TypeScript** - Type-safe development with full IntelliSense support
- **React 18** - Latest React features with concurrent rendering

### State Management & Data Fetching
- **TanStack Query (React Query)** - Powerful data synchronization with automatic caching, background updates, and optimistic updates
- **Axios** - Promise-based HTTP client for API communication
- **React Hook Form** - Performant form validation with minimal re-renders
- **Zod** - TypeScript-first schema validation for forms and API responses

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **FontAwesome** - Comprehensive icon library
- **Sonner** - Beautiful toast notifications
- **Custom Components** - Reusable UI components (Table, Pagination, Search, Modals)

### API & Code Generation
- **OpenAPI Generator** - Auto-generates TypeScript API clients from OpenAPI specifications
- **OpenAPI 3.0** - API-first development with automatic type generation

### Additional Features
- **Barcode Scanning** - Integrated camera-based barcode scanner for quick product lookup
- **VNPay Integration** - Vietnamese payment gateway for online transactions
- **Timezone Management** - Automatic GMT+7 (Vietnam) timezone conversion

## 📁 Project Structure

```
green-store/
├── app/                          # Next.js App Router
│   ├── categories/              # Category management
│   │   ├── page.tsx            # Category list page
│   │   ├── components/         # Category-specific components
│   │   └── hooks/              # Category React Query hooks
│   │
│   ├── customers/              # Customer management
│   ├── inventory/              # Inventory & stock management
│   │   ├── components/
│   │   │   ├── create-inventory.modal.tsx
│   │   │   └── inventory-detail.modal.tsx
│   │   └── hooks/
│   │
│   ├── orders/                 # Order tracking & history
│   ├── payments/               # Point-of-sale & checkout
│   │   ├── page.tsx           # POS interface with barcode scanner
│   │   ├── components/
│   │   │   └── barcode-scanner.tsx
│   │   └── hooks/
│   │
│   ├── products/               # Product catalog management
│   ├── staff/                  # Staff & employee management
│   ├── suppliers/              # Supplier management
│   │
│   ├── login/                  # Authentication
│   ├── hooks/                  # Shared hooks (statistics, etc.)
│   └── lib/                    # Shared utilities
│       └── api/                # Auto-generated API clients
│           ├── apis.ts         # Centralized API configuration
│           ├── apis/           # API service classes
│           └── models/         # TypeScript interfaces
│
├── components/                  # Shared reusable components
│   ├── auth-guard.tsx          # Route protection
│   ├── button.tsx              # Custom button component
│   ├── confirm-alert.tsx       # Confirmation dialogs
│   ├── pagination.tsx          # Pagination controls
│   ├── search-input.tsx        # Search with debouncing
│   ├── sidebar.tsx             # Navigation sidebar
│   ├── table-prop.tsx          # Data table with selection
│   └── skeletons/              # Loading skeletons
│
├── public/                      # Static assets
├── openapi.json                # OpenAPI specification
└── package.json
```

## ✨ Key Features

### 1. **Inventory Management**
- Real-time stock tracking
- Product search with autocomplete
- Supplier association for each inventory item
- Automatic timestamp with timezone correction
- Bulk operations (delete multiple items)
<img width="1919" height="1199" alt="image" src="https://github.com/user-attachments/assets/204a045e-1a15-499b-a87e-5e8e4a7ee43f" />

### 2. **Point of Sale (POS)**
- Barcode scanner integration (camera-based)
- Manual product search and selection
- Real-time cart management
- Customer identification by phone number
- Automatic promotion application based on order total
- Multiple payment methods:
  - Cash
  - Card (VNPay integration)
  - Bank Transfer
- Order summary with itemized breakdown
<img width="1919" height="1199" alt="image" src="https://github.com/user-attachments/assets/f8e8829b-a749-4392-8a4d-74a8fe64887a" />


### 3. **Customer Management**
- Customer registration with contact details
- Purchase history tracking
- Order count statistics
- Quick customer lookup during checkout
- Membership status display
<img width="1919" height="1199" alt="image" src="https://github.com/user-attachments/assets/c3d58489-df8f-4ee4-b056-c2b5e9deba62" />


### 4. **Product Catalog**
- Comprehensive product information (name, barcode, price, unit, images)
- Category and supplier filtering
- Bulk import/export capabilities
- Image upload support
- Search by name or barcode
<img width="1919" height="1199" alt="image" src="https://github.com/user-attachments/assets/93f038de-17e6-42ff-983c-357275e6fa4b" />


### 5. **Order Tracking**
- Complete order history
- Order status management (Pending, Paid, Cancelled)
- Detailed order view with line items
- Customer and employee information
- Discount and promotion tracking
<img width="1919" height="1199" alt="image" src="https://github.com/user-attachments/assets/a5bd75a8-d7f5-4352-83fa-ab5eb077a4a1" />


### 6. **Supplier Management**
- Supplier contact information
- Product association
- Filter products by supplier
<img width="1919" height="1199" alt="image" src="https://github.com/user-attachments/assets/dc41b80f-5898-4030-b875-2070a15e5693" />


### 7. **Staff Management**
- Employee accounts
- Role-based access (future enhancement)
- Activity tracking
<img width="1919" height="1199" alt="image" src="https://github.com/user-attachments/assets/9ac875d0-6019-4a66-97e4-e93ed099b9f6" />


## 🎯 Architectural Advantages

### 1. **Type Safety Throughout**
- End-to-end TypeScript ensures compile-time error detection
- Auto-generated API clients guarantee API contract compliance
- Zod schemas validate runtime data
- Reduced bugs and improved developer experience

### 2. **Optimized Data Management**
- React Query handles caching, reducing unnecessary API calls
- Automatic background refetching keeps data fresh
- Optimistic updates for instant UI feedback
- Query invalidation ensures data consistency

### 3. **Code Generation & DRY Principle**
- OpenAPI Generator eliminates manual API client code
- Shared components reduce code duplication
- Custom hooks encapsulate business logic
- Consistent patterns across all features

### 4. **Performance Optimizations**
- Next.js App Router with automatic code splitting
- React Query caching reduces server load
- Debounced search inputs minimize API requests
- Lazy loading for modals and dialogs
- Memoized computations (useMemo) for expensive operations

### 5. **Developer Experience**
- Clear feature-based folder structure
- Consistent naming conventions
- Reusable hooks and components
- TypeScript IntelliSense for rapid development
- Hot module replacement for fast iteration

### 6. **User Experience**
- Instant search with autocomplete
- Loading states and skeletons
- Toast notifications for user feedback
- Responsive design for mobile and desktop
- Keyboard navigation support
- Confirmation dialogs prevent accidental actions

### 7. **Scalability**
- Modular architecture allows easy feature addition
- Centralized API configuration
- Query key factories for organized cache management
- Pagination support for large datasets
- Server-side filtering and sorting

### 8. **Business Logic Advantages**
- Automatic promotion filtering by order amount
- Timezone-aware timestamp handling for accurate reporting
- Multi-payment method support
- Barcode scanning for faster checkout
- Customer loyalty tracking

## 🛠️ Setup & Installation

```bash
# Install dependencies
npm install

# Generate API clients from OpenAPI spec
npm run generate-api

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### API Configuration
Update the base URL in `app/lib/api/apis.ts`:
```typescript
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
```

### Environment Variables
Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_VNPAY_TMN_CODE=your_vnpay_code
NEXT_PUBLIC_VNPAY_RETURN_URL=your_return_url
```

## 📊 API Integration

The project uses OpenAPI Generator to automatically create TypeScript API clients. When the backend API specification changes:

1. Update `openapi.json` with the new specification
2. Run `npm run generate-api` to regenerate clients
3. TypeScript will immediately show any breaking changes

## 🎨 Customization

### Adding New Features
1. Create a new folder in `app/` (e.g., `app/new-feature/`)
2. Add `page.tsx` for the main component
3. Create `hooks/` for React Query operations
4. Add `components/` for feature-specific UI
5. Update sidebar navigation in `components/sidebar.tsx`

### Custom Components
All shared components are in `components/` and can be styled/modified:
- `table-prop.tsx` - Data tables with sorting and selection
- `pagination.tsx` - Customizable pagination controls
- `search-input.tsx` - Debounced search input
- `button.tsx` - Styled button variants

## 🔐 Authentication

The system uses token-based authentication with localStorage:
- Login credentials stored in `localStorage`
- Protected routes with `auth-guard.tsx`
- Automatic redirect to login for unauthenticated users

## 🌍 Timezone Handling

All timestamps are automatically converted to Vietnam timezone (GMT+7):
- Payment timestamps adjusted before sending to API
- Display timestamps converted for correct local time
- Prevents 7-hour time discrepancies

## 📝 Best Practices Used

1. **Component Organization** - Feature-based structure for better maintainability
2. **Custom Hooks** - Encapsulated business logic and API calls
3. **Type Safety** - Comprehensive TypeScript usage
4. **Error Handling** - Try-catch blocks with user-friendly messages
5. **Loading States** - Skeleton screens and loading indicators
6. **Validation** - Zod schemas for form validation
7. **Code Splitting** - Lazy loading for modals and heavy components
8. **Accessibility** - Proper ARIA labels and semantic HTML

## 📈 Future Enhancements

- Role-based access control (RBAC)
- Real-time notifications with WebSockets
- Advanced reporting and analytics dashboard
- Inventory forecasting with ML
- Multi-language support (i18n)
- Dark mode theme
- Export to Excel/PDF
- Offline mode with service workers

## 🤝 Contributing

This project follows standard Git workflow:
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

---

**Built with ❤️ using Next.js and TypeScript**
