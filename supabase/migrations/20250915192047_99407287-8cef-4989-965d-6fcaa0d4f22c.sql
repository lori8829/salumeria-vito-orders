-- Create storage bucket for order images
INSERT INTO storage.buckets (id, name, public) VALUES ('order-images', 'order-images', true);

-- Create policies for order images bucket
CREATE POLICY "Order images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'order-images');

CREATE POLICY "Anyone can upload order images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'order-images');

CREATE POLICY "Anyone can update order images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'order-images');

CREATE POLICY "Anyone can delete order images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'order-images');