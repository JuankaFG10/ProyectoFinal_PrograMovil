import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ucabteifrzyojrdjckxb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjYWJ0ZWlmcnp5b2pyZGpja3hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NzY1MjEsImV4cCI6MjA4OTQ1MjUyMX0.GY7uKtO1lsQvcD44Plzr6nR1sM-Sb-XvMg2Wff4Mfls';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);