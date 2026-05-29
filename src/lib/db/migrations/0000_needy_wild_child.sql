CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"body" text NOT NULL,
	"cover_image" text NOT NULL,
	"category" text NOT NULL,
	"author" text NOT NULL,
	"published_at" timestamp,
	"status" text DEFAULT 'draft' NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "dealers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"city" text NOT NULL,
	"province" text NOT NULL,
	"address" text NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"phone" text NOT NULL,
	"whatsapp" text NOT NULL,
	"type" text NOT NULL,
	"hours" text NOT NULL,
	"map_url" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"owner_user_id" uuid
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"category" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "features" (
	"id" serial PRIMARY KEY NOT NULL,
	"icon" text NOT NULL,
	"title" text NOT NULL,
	"blurb" text NOT NULL,
	"category" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "installment_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"full_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"city" text NOT NULL,
	"model_id" integer NOT NULL,
	"variant_id" integer NOT NULL,
	"down_payment" integer NOT NULL,
	"tenure_months" integer NOT NULL,
	"estimated_monthly" integer NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "installment_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"down_payment_pct" double precision NOT NULL,
	"tenure_months" integer NOT NULL,
	"markup_pct" double precision NOT NULL,
	"description" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"city" text NOT NULL,
	"source" text NOT NULL,
	"model_id" integer,
	"variant_id" integer,
	"status" text DEFAULT 'new' NOT NULL,
	"assigned_dealer_id" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "model_to_features" (
	"model_id" integer NOT NULL,
	"feature_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "model_variants" (
	"id" serial PRIMARY KEY NOT NULL,
	"model_id" integer NOT NULL,
	"name" text NOT NULL,
	"battery_type" text NOT NULL,
	"price" integer NOT NULL,
	"original_price" integer,
	"top_speed_kmh" integer NOT NULL,
	"range_km" integer NOT NULL,
	"charging_time_hrs" double precision NOT NULL,
	"battery_life_years" double precision NOT NULL,
	"motor_watts" integer NOT NULL,
	"voltage" integer NOT NULL,
	"amp_hours" integer NOT NULL,
	"charge_cycles" integer NOT NULL,
	"warranty_months" integer NOT NULL,
	"weight_kg" integer NOT NULL,
	"load_kg" integer NOT NULL,
	"brakes" text NOT NULL,
	"suspension" text NOT NULL,
	"tyres" text NOT NULL,
	"ip_rating" text NOT NULL,
	"smart_features" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "models" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"tagline" text NOT NULL,
	"type" text NOT NULL,
	"description" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"hero_image" text NOT NULL,
	"images" text[] NOT NULL,
	"colors" jsonb NOT NULL,
	"base_price" integer NOT NULL,
	"original_price" integer,
	"in_stock" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "models_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"role" text DEFAULT 'customer' NOT NULL,
	"name" text NOT NULL,
	"phone" text,
	"email" text NOT NULL,
	"city" text,
	"cnic" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reservations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"model_id" integer NOT NULL,
	"variant_id" integer NOT NULL,
	"color" text NOT NULL,
	"unit_price" integer NOT NULL,
	"payment_type" text NOT NULL,
	"amount_paid" integer NOT NULL,
	"payment_status" text DEFAULT 'pending' NOT NULL,
	"payment_provider" text NOT NULL,
	"provider_ref" text,
	"order_ref" text NOT NULL,
	"fulfilment_status" text DEFAULT 'pending' NOT NULL,
	"dealer_id" integer,
	"shipping_address" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "reservations_order_ref_unique" UNIQUE("order_ref")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"rating" integer NOT NULL,
	"quote" text NOT NULL,
	"source_url" text,
	"model_id" integer,
	"is_approved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "savings_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"petrol_price_default" double precision NOT NULL,
	"petrol_presets" jsonb NOT NULL,
	"electricity_rate" double precision NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"brand_name" text NOT NULL,
	"whatsapp_number" text NOT NULL,
	"social_links" jsonb NOT NULL,
	"impact_stats" jsonb NOT NULL,
	"hero_video_url" text NOT NULL,
	"contact_email" text NOT NULL,
	"contact_phone" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sms_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone" text NOT NULL,
	"message" text NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_ride_bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"model_id" integer NOT NULL,
	"dealer_id" integer NOT NULL,
	"date" text NOT NULL,
	"time_slot" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "dealers" ADD CONSTRAINT "dealers_owner_user_id_profiles_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "installment_applications" ADD CONSTRAINT "installment_applications_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "installment_applications" ADD CONSTRAINT "installment_applications_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "installment_applications" ADD CONSTRAINT "installment_applications_variant_id_model_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."model_variants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_variant_id_model_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."model_variants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_dealer_id_dealers_id_fk" FOREIGN KEY ("assigned_dealer_id") REFERENCES "public"."dealers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_to_features" ADD CONSTRAINT "model_to_features_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_to_features" ADD CONSTRAINT "model_to_features_feature_id_features_id_fk" FOREIGN KEY ("feature_id") REFERENCES "public"."features"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_variants" ADD CONSTRAINT "model_variants_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_variant_id_model_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."model_variants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_dealer_id_dealers_id_fk" FOREIGN KEY ("dealer_id") REFERENCES "public"."dealers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_ride_bookings" ADD CONSTRAINT "test_ride_bookings_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_ride_bookings" ADD CONSTRAINT "test_ride_bookings_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_ride_bookings" ADD CONSTRAINT "test_ride_bookings_dealer_id_dealers_id_fk" FOREIGN KEY ("dealer_id") REFERENCES "public"."dealers"("id") ON DELETE cascade ON UPDATE no action;