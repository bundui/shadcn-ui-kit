-- Allow Admins to view all promo_banners (both active and inactive) so they can manage and toggle status in the dashboard
DROP POLICY IF EXISTS "Admins can view all banners" ON public.promo_banners;
CREATE POLICY "Admins can view all banners" 
ON public.promo_banners FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    JOIN public.roles ON profiles.role_id = roles.id
    WHERE profiles.id = auth.uid() AND roles.name = 'admin'
  )
);
