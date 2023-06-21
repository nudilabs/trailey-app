import { serve } from 'inngest/next';
import { inngest, fns } from '@/inngest';
// Create a client to send and receive events

// Create an API that serves zero functions
export default serve(inngest, fns);
