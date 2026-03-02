import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('  - NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');
  console.error('Please check your .env.local file');
}

// Validate URL format
if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL should start with https://');
  console.error('   Current value:', supabaseUrl);
  console.error('   Should be like: https://your-project.supabase.co');
}

if (supabaseUrl && supabaseUrl.includes('/rest/v1')) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL should NOT include /rest/v1');
  console.error('   Current value:', supabaseUrl);
  console.error('   Remove the /rest/v1 part');
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '', {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
    timeout: 30000,
  },
  db: {
    schema: 'public',
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Log connection status on client side
if (typeof window !== 'undefined') {
  console.log('\n' + '='.repeat(60));
  console.log('🔌 SUPABASE CONFIGURATION');
  console.log('='.repeat(60));
  console.log('📋 Environment Variables:');
  
  if (supabaseUrl) {
    console.log(`   ✅ URL: ${supabaseUrl}`);
    console.log(`   ✅ Domain: ${new URL(supabaseUrl).hostname}`);
  } else {
    console.error('   ❌ URL: Missing');
  }
  
  if (supabaseKey) {
    console.log(`   ✅ Key: ${supabaseKey.substring(0, 15)}...`);
  } else {
    console.error('   ❌ Key: Missing');
  }
  
  console.log('\n📡 WebSocket Details:');
  if (supabaseUrl) {
    const wsUrl = supabaseUrl.replace('https://', 'wss://').replace('http://', 'ws://');
    console.log(`   WebSocket URL: ${wsUrl}/realtime/v1`);
  }
  
  console.log('='.repeat(60) + '\n');
}
