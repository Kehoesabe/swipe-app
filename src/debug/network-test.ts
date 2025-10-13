/**
 * Network Debug Test
 * 
 * This test helps debug network issues and environment variable problems
 * by logging detailed information about requests and responses.
 */

export interface NetworkTestResult {
  success: boolean;
  error?: string;
  details: {
    url: string;
    status?: number;
    headers?: Record<string, string>;
    body?: any;
    environment?: {
      hasSupabaseUrl: boolean;
      hasSupabaseKey: boolean;
      supabaseUrl?: string;
      supabaseKey?: string;
    };
  };
}

/**
 * Test environment variables
 */
export function testEnvironmentVariables(): NetworkTestResult {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 
                     process.env.NEXT_PUBLIC_SUPABASE_URL || 
                     'https://ciodftgvmnphuhvjnmis.supabase.co';
  
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
                     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpb2RmdGd2bW5waHVodmpubWlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMDk2MTAsImV4cCI6MjA3NTU4NTYxMH0.lGgrd6IzkIkwrPtgxE9TPqaLWcmvepZTrBNFleTFfOQ';

  const hasSupabaseUrl = Boolean(supabaseUrl && supabaseUrl !== 'undefined');
  const hasSupabaseKey = Boolean(supabaseKey && supabaseKey !== 'undefined');

  console.log('🔧 Environment Variables Test:', {
    hasSupabaseUrl,
    hasSupabaseKey,
    supabaseUrl: supabaseUrl?.slice(0, 30) + '...',
    supabaseKey: supabaseKey?.slice(0, 20) + '...',
    processEnv: Object.keys(process.env).filter(k => k.includes('SUPABASE')),
  });

  return {
    success: hasSupabaseUrl && hasSupabaseKey,
    details: {
      url: 'environment-check',
      environment: {
        hasSupabaseUrl,
        hasSupabaseKey,
        supabaseUrl,
        supabaseKey,
      },
    },
  };
}

/**
 * Test Supabase connection
 */
export async function testSupabaseConnection(): Promise<NetworkTestResult> {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 
                       process.env.NEXT_PUBLIC_SUPABASE_URL || 
                       'https://ciodftgvmnphuhvjnmis.supabase.co';
    
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
                       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpb2RmdGd2bW5waHVodmpubWlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMDk2MTAsImV4cCI6MjA3NTU4NTYxMH0.lGgrd6IzkIkwrPtgxE9TPqaLWcmvepZTrBNFleTFfOQ';

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test a simple query
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    console.log('🔧 Supabase Connection Test:', {
      success: !error,
      error: error?.message,
      data,
    });

    return {
      success: !error,
      error: error?.message,
      details: {
        url: supabaseUrl,
        status: error ? 400 : 200,
        body: data,
        environment: {
          hasSupabaseUrl: Boolean(supabaseUrl),
          hasSupabaseKey: Boolean(supabaseKey),
          supabaseUrl,
          supabaseKey,
        },
      },
    };
  } catch (error) {
    console.error('❌ Supabase Connection Test Failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: {
        url: 'supabase-connection',
        environment: {
          hasSupabaseUrl: false,
          hasSupabaseKey: false,
        },
      },
    };
  }
}

/**
 * Test Edge Functions
 */
export async function testEdgeFunctions(): Promise<NetworkTestResult> {
  try {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 
                       process.env.NEXT_PUBLIC_SUPABASE_URL || 
                       'https://ciodftgvmnphuhvjnmis.supabase.co';
    
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
                       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpb2RmdGd2bW5waHVodmpubWlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMDk2MTAsImV4cCI6MjA3NTU4NTYxMH0.lGgrd6IzkIkwrPtgxE9TPqaLWcmvepZTrBNFleTFfOQ';

    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/health`;
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Content-Type': 'application/json',
      },
    });

    const responseText = await response.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    console.log('🔧 Edge Functions Test:', {
      url: edgeFunctionUrl,
      status: response.status,
      success: response.ok,
      response: responseData,
    });

    return {
      success: response.ok,
      error: response.ok ? undefined : `HTTP ${response.status}: ${responseText}`,
      details: {
        url: edgeFunctionUrl,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseData,
        environment: {
          hasSupabaseUrl: Boolean(supabaseUrl),
          hasSupabaseKey: Boolean(supabaseKey),
          supabaseUrl,
          supabaseKey,
        },
      },
    };
  } catch (error) {
    console.error('❌ Edge Functions Test Failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: {
        url: 'edge-functions',
        environment: {
          hasSupabaseUrl: false,
          hasSupabaseKey: false,
        },
      },
    };
  }
}

/**
 * Run all network tests
 */
export async function runAllNetworkTests(): Promise<{
  environment: NetworkTestResult;
  supabase: NetworkTestResult;
  edgeFunctions: NetworkTestResult;
  summary: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    overallSuccess: boolean;
  };
}> {
  console.log('🚀 Starting Network Debug Tests...');
  
  const environment = testEnvironmentVariables();
  const supabase = await testSupabaseConnection();
  const edgeFunctions = await testEdgeFunctions();
  
  const results = [environment, supabase, edgeFunctions];
  const passedTests = results.filter(r => r.success).length;
  const failedTests = results.filter(r => !r.success).length;
  
  const summary = {
    totalTests: results.length,
    passedTests,
    failedTests,
    overallSuccess: failedTests === 0,
  };
  
  console.log('📊 Network Test Summary:', summary);
  
  return {
    environment,
    supabase,
    edgeFunctions,
    summary,
  };
}

/**
 * Test specific to the assessment flow
 */
export async function testAssessmentFlow(): Promise<NetworkTestResult> {
  try {
    // Test if we can create a session
    const { createClient } = await import('@supabase/supabase-js');
    
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 
                       process.env.NEXT_PUBLIC_SUPABASE_URL || 
                       'https://ciodftgvmnphuhvjnmis.supabase.co';
    
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
                       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpb2RmdGd2bW5waHVodmpubWlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMDk2MTAsImV4cCI6MjA3NTU4NTYxMH0.lGgrd6IzkIkwrPtgxE9TPqaLWcmvepZTrBNFleTFfOQ';

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test session creation
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    console.log('🔧 Assessment Flow Test:', {
      sessionExists: Boolean(sessionData.session),
      sessionError: sessionError?.message,
    });

    return {
      success: !sessionError,
      error: sessionError?.message,
      details: {
        url: 'assessment-flow',
        status: sessionError ? 400 : 200,
        body: sessionData,
        environment: {
          hasSupabaseUrl: Boolean(supabaseUrl),
          hasSupabaseKey: Boolean(supabaseKey),
          supabaseUrl,
          supabaseKey,
        },
      },
    };
  } catch (error) {
    console.error('❌ Assessment Flow Test Failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: {
        url: 'assessment-flow',
        environment: {
          hasSupabaseUrl: false,
          hasSupabaseKey: false,
        },
      },
    };
  }
}
