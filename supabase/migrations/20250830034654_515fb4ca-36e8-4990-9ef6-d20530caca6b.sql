-- Fix OTP expiry to recommended threshold (1 hour)
UPDATE auth.config 
SET otp_exp = 3600 
WHERE otp_exp > 3600;