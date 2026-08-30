-- Pin an empty search_path on the prune trigger functions (they already fully
-- qualify every object) so they can't be hijacked via a mutable search_path.
alter function public.prune_recent_searches() set search_path = '';
alter function public.prune_recent_products() set search_path = '';
