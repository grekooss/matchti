// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

interface WebhookPayload {
  type: 'OBJECT_REMOVED';
  old_record: {
    name: string; // Ścieżka do pliku
  };
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const payload: WebhookPayload = await req.json();

    if (payload.type === 'OBJECT_REMOVED') {
      const filePath = payload.old_record.name;

      if (!filePath) {
        throw new Error('File path not found in webhook payload');
      }

      console.log(
        `File removed event. Triggering DB function for: ${filePath}`
      );

      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );

      // Wywołaj funkcję RPC (Remote Procedure Call) w bazie danych
      const { error } = await supabaseClient.rpc(
        'handle_photo_deletion_and_promote',
        {
          deleted_storage_path: filePath,
        }
      );

      if (error) {
        console.error('Error calling DB function:', error);
        throw error;
      }

      console.log(`Successfully processed deletion for: ${filePath}`);
      return new Response(
        JSON.stringify({
          success: true,
          message: `DB function executed for ${filePath}`,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Event ignored.' }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (e) {
    console.error('Error processing webhook:', e.message);
    return new Response(JSON.stringify({ error: e.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
