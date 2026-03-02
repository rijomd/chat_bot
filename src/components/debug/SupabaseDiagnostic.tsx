'use client';

import { useEffect } from 'react';

/**
 * Supabase Connection Diagnostic Component
 * 
 * Add this to your page.tsx temporarily to diagnose connection issues:
 * 
 * import { SupabaseDiagnostic } from '@/components/debug/SupabaseDiagnostic';
 * 
 * Then in your JSX:
 * <SupabaseDiagnostic />
 */

export function SupabaseDiagnostic() {
  useEffect(() => {
    const runDiagnostics = async () => {
      console.log('\n' + '='.repeat(60));
      console.log('🔧 SUPABASE CONNECTION DIAGNOSTIC');
      console.log('='.repeat(60));

      // 1. Check Environment Variables
      console.log('\n📋 1️⃣ Environment Variables:');
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl) {
        console.error('   ❌ NEXT_PUBLIC_SUPABASE_URL is missing');
      } else {
        console.log(`   ✅ NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl.split('/')[2]}`);
      }

      if (!supabaseKey) {
        console.error('   ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');
      } else {
        console.log(`   ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey.substring(0, 20)}...`);
      }

      // 2. Test Supabase Connection
      console.log('\n🔌 2️⃣ Testing Supabase Connection:');
      try {
        if (!supabaseUrl) {
          console.error('   ❌ Cannot test - URL is missing');
          return;
        }

        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          headers: {
            'apikey': supabaseKey || '',
          },
        });

        if (response.ok) {
          console.log('   ✅ Supabase REST API is reachable');
        } else {
          console.error(`   ❌ Supabase returned status ${response.status}`);
          if (response.status === 401) {
            console.error('      → Invalid API key or URL');
          }
        }
      } catch (error: any) {
        console.error('   ❌ Cannot reach Supabase:', error.message);
      }

      // 3. Check Realtime WebSocket
      console.log('\n🔗 3️⃣ Testing Supabase Realtime (WebSocket):');
      try {
        if (!supabaseUrl) {
          console.error('   ❌ Cannot test - URL is missing');
          return;
        }

        // Try to connect to WebSocket
        const wsUrl = supabaseUrl.replace('https://', 'wss://').replace('http://', 'ws://');
        const ws = new WebSocket(`${wsUrl}/realtime/v1`);

        let resolved = false;

        const timeout = setTimeout(() => {
          if (!resolved) {
            console.error('   ⚠️ WebSocket connection timed out (>5 seconds)');
            resolved = true;
            ws.close();
          }
        }, 5000);

        ws.onopen = () => {
          console.log('   ✅ Realtime WebSocket connection: OPEN');
          resolved = true;
          clearTimeout(timeout);
          ws.close();
        };

        ws.onerror = () => {
          console.error('   ❌ Realtime WebSocket connection: ERROR');
          resolved = true;
          clearTimeout(timeout);
        };

        ws.onclose = () => {
          if (!resolved) {
            console.error('   ❌ Realtime WebSocket connection: CLOSED (before completing)');
            resolved = true;
            clearTimeout(timeout);
          }
        };
      } catch (error: any) {
        console.error('   ❌ WebSocket test failed:', error.message);
      }

      // 4. Check Backend API
      console.log('\n🛣️ 4️⃣ Testing Backend API Routes:');
      try {
        const response = await fetch('/api/chat/messages?conversationId=test', {
          method: 'GET',
        });

        if (response.status === 400) {
          console.log('   ✅ Backend API is working (returned 400 for test - expected)');
        } else if (response.status === 401) {
          console.log('   ⚠️ Backend API returned 401 - you may not be logged in');
        } else if (response.ok) {
          console.log('   ✅ Backend API is reachable');
        } else {
          console.error(`   ❌ Backend API returned status ${response.status}`);
        }
      } catch (error: any) {
        console.error('   ❌ Cannot reach backend API:', error.message);
      }

      // 5. Browser Information
      console.log('\n💻 5️⃣ Browser Information:');
      console.log('   - Online:', navigator.onLine);
      console.log('   - User Agent:', navigator.userAgent.substring(0, 50) + '...');

      // 6. Recommendations
      console.log('\n✅ 6️⃣ Recommendations:');
      if (!supabaseUrl || !supabaseKey) {
        console.log('   1. Check your .env.local file has both variables set');
        console.log('   2. Restart the development server: npm run dev');
        console.log('   3. Clear browser cache (Ctrl+Shift+Delete)');
      } else {
        console.log('   1. Check Supabase Dashboard for Realtime status');
        console.log('   2. Verify messages table has Realtime enabled');
        console.log('   3. Check browser Network tab for WebSocket errors');
      }

      console.log('\n' + '='.repeat(60) + '\n');
    };

    runDiagnostics();
  }, []);

  return null; // This component doesn't render anything
}
