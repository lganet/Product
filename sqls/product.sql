
-- Database: product

-- DROP DATABASE product;
/*
CREATE DATABASE product
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
*/
	
	
DO
$do$
DECLARE
  _db TEXT := 'product';
  _user TEXT := 'postgres';
  _password TEXT := 'changeme';
BEGIN
  CREATE EXTENSION IF NOT EXISTS dblink; -- enable extension 
  IF EXISTS (SELECT 1 FROM pg_database WHERE datname = _db) THEN
    RAISE NOTICE 'Database already exists';
  ELSE
    PERFORM dblink_connect('host=localhost user=' || _user || ' password=' || _password || ' dbname=' || current_database());
    PERFORM dblink_exec('CREATE DATABASE ' || _db || ' WITH OWNER = postgres ENCODING = "UTF8" LC_COLLATE = "en_US.utf8" LC_CTYPE = "en_US.utf8" TABLESPACE = pg_default CONNECTION LIMIT = -1');
  END IF;
END;
$do$
;
CREATE TABLE IF NOT EXISTS "product"."public"."product"
(
    "Id" serial NOT NULL,
    "Name" character varying(100) NOT NULL,
    "Price" numeric(13, 2) NOT NULL,
    PRIMARY KEY ("Id"),
    CONSTRAINT "UNIQUE_Name" UNIQUE ("Name")
)

TABLESPACE pg_default;

/*
CREATE SEQUENCE IF NOT EXISTS public."product_Id_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE public."product_Id_seq"
    OWNER TO postgres;
*/

CREATE TABLE IF NOT EXISTS product.public."productviews"
(
    "ProductId" integer NOT NULL,
    "NumberOfViews" integer NOT NULL,
    PRIMARY KEY ("ProductId"),
    CONSTRAINT "FK_Product_X_ProductViews" FOREIGN KEY ("ProductId")
        REFERENCES public.product ("Id") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;


ALTER TABLE product.public."product"
    OWNER to postgres;

ALTER TABLE product.public."productviews"
    OWNER to postgres;