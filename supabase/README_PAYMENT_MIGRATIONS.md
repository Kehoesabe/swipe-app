# Payment System Database Migrations

This directory contains the database migrations for the Swipe Type payment system.

## Migration Files

1. **`20250110_create_purchases.sql`** - Creates the purchases table for Stripe payment tracking
2. **`20250110_create_premium_access.sql`** - Creates the premium_access table for access control
3. **`20250110_create_audit_log.sql`** - Creates the audit_log table for payment event tracking
4. **`20250110_test_payment_data.sql`** - Inserts test data (development only)
5. **`verify_payment_tables.sql`** - Verification script to test the setup

## Running Migrations

### Option 1: Supabase CLI (Recommended)
```bash
# Navigate to project directory
cd swipe-app

# Run migrations
supabase db push

# Or run specific migration
supabase db push --file supabase/migrations/20250110_create_purchases.sql
```

### Option 2: Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste each migration file content
4. Run them in order

### Option 3: Direct SQL Connection
```bash
# Connect to your database and run migrations
psql "postgresql://[connection-string]"
\i supabase/migrations/20250110_create_purchases.sql
\i supabase/migrations/20250110_create_premium_access.sql
\i supabase/migrations/20250110_create_audit_log.sql
```

## Verification

After running migrations, execute the verification script:

```sql
-- In Supabase SQL Editor or psql
\i supabase/verify_payment_tables.sql
```

This will show:
- ✅ Tables created successfully
- ✅ RLS policies enabled
- ✅ Indexes created
- ✅ Test data (if in development)

## Database Schema

### Purchases Table
- **Purpose**: Store Stripe payment records
- **Key Fields**: `stripe_payment_intent_id`, `amount`, `status`
- **RLS**: Users can only see their own purchases

### Premium Access Table
- **Purpose**: Track premium access grants
- **Key Fields**: `user_id`, `assessment_id`, `expires_at`
- **RLS**: Users can only see their own access

### Audit Log Table
- **Purpose**: Track payment events and system actions
- **Key Fields**: `action`, `resource_type`, `resource_id`
- **RLS**: Users can only see their own audit logs

## Security Features

- **Row Level Security (RLS)** enabled on all tables
- **User isolation** - users can only access their own data
- **System policies** for webhook processing
- **Audit trail** for all payment events
- **Unique constraints** to prevent duplicate access

## Testing

The test data migration will only run in development environment. It creates:
- 1 test purchase record
- 1 test premium access record  
- 1 test audit log entry

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**
   - Ensure user is authenticated
   - Check policy conditions match your use case

2. **Foreign Key Errors**
   - Ensure `auth.users` table exists
   - Check UUID format for test data

3. **Permission Errors**
   - Ensure you have sufficient database permissions
   - Check if RLS policies are blocking access

### Verification Commands

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('purchases', 'premium_access', 'audit_log');

-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('purchases', 'premium_access', 'audit_log');

-- Test RLS policies
SELECT * FROM purchases LIMIT 1;
```

## Next Steps

After successful migration:
1. ✅ Verify tables exist in Supabase dashboard
2. ✅ Test RLS policies work correctly
3. ✅ Confirm indexes are created
4. ✅ Run verification script
5. ✅ Proceed to Phase B2: API Integration

