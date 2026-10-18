// Supabase Configuration
const SUPABASE_URL = 'https://uvfjrfstvtjccifenxeb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2ZmpyZnN0dnRqY2NpZmVueGViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4NzkxOTgsImV4cCI6MjEwNjQ1NTE5OH0.ruaD8-Ts72usHk0oc3kKyjFKcUQpB-cqIHlh70F2kqc';

// Verificar que la librería esté cargada antes de instanciar
if (typeof supabase !== 'undefined' && supabase.createClient) {
  window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
  window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.error('No se pudo cargar la librería de Supabase.');
}