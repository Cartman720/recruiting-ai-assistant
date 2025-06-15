

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."ExpertiseLevel" AS ENUM (
    'intern',
    'junior',
    'mid',
    'senior',
    'lead',
    'principal'
);


ALTER TYPE "public"."ExpertiseLevel" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."Candidate" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "skills" "text"[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "rawResume" "text" NOT NULL,
    "summary" "text" NOT NULL,
    "educationLevel" "text",
    "location" "text",
    "yearsOfExperience" integer,
    "expertiseLevel" "public"."ExpertiseLevel",
    "city" "text",
    "country" "text",
    "state" "text",
    "certifications" "text"[],
    "languages" "text"[],
    "willingToRelocate" boolean,
    "hasRemoteExperience" boolean
);


ALTER TABLE "public"."Candidate" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Education" (
    "id" "text" NOT NULL,
    "school" "text" NOT NULL,
    "degree" "text" NOT NULL,
    "startDate" timestamp(3) without time zone,
    "endDate" timestamp(3) without time zone,
    "candidateId" "text" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."Education" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Experience" (
    "id" "text" NOT NULL,
    "company" "text" NOT NULL,
    "title" "text" NOT NULL,
    "startDate" timestamp(3) without time zone,
    "endDate" timestamp(3) without time zone,
    "description" "text" NOT NULL,
    "candidateId" "text" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."Experience" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Industry" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "parentId" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "slug" "text" NOT NULL
);


ALTER TABLE "public"."Industry" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."_CandidateToIndustry" (
    "A" "text" NOT NULL,
    "B" "text" NOT NULL
);


ALTER TABLE "public"."_CandidateToIndustry" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."_prisma_migrations" (
    "id" character varying(36) NOT NULL,
    "checksum" character varying(64) NOT NULL,
    "finished_at" timestamp with time zone,
    "migration_name" character varying(255) NOT NULL,
    "logs" "text",
    "rolled_back_at" timestamp with time zone,
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "applied_steps_count" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."_prisma_migrations" OWNER TO "postgres";


ALTER TABLE ONLY "public"."Candidate"
    ADD CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Education"
    ADD CONSTRAINT "Education_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Experience"
    ADD CONSTRAINT "Experience_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Industry"
    ADD CONSTRAINT "Industry_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."_CandidateToIndustry"
    ADD CONSTRAINT "_CandidateToIndustry_AB_pkey" PRIMARY KEY ("A", "B");



ALTER TABLE ONLY "public"."_prisma_migrations"
    ADD CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id");



CREATE UNIQUE INDEX "Candidate_email_key" ON "public"."Candidate" USING "btree" ("email");



CREATE UNIQUE INDEX "Industry_name_key" ON "public"."Industry" USING "btree" ("name");



CREATE UNIQUE INDEX "Industry_slug_key" ON "public"."Industry" USING "btree" ("slug");



CREATE INDEX "_CandidateToIndustry_B_index" ON "public"."_CandidateToIndustry" USING "btree" ("B");



ALTER TABLE ONLY "public"."Education"
    ADD CONSTRAINT "Education_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "public"."Candidate"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Experience"
    ADD CONSTRAINT "Experience_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "public"."Candidate"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Industry"
    ADD CONSTRAINT "Industry_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Industry"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."_CandidateToIndustry"
    ADD CONSTRAINT "_CandidateToIndustry_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Candidate"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."_CandidateToIndustry"
    ADD CONSTRAINT "_CandidateToIndustry_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Industry"("id") ON UPDATE CASCADE ON DELETE CASCADE;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";








































































































































































GRANT ALL ON TABLE "public"."Candidate" TO "anon";
GRANT ALL ON TABLE "public"."Candidate" TO "authenticated";
GRANT ALL ON TABLE "public"."Candidate" TO "service_role";



GRANT ALL ON TABLE "public"."Education" TO "anon";
GRANT ALL ON TABLE "public"."Education" TO "authenticated";
GRANT ALL ON TABLE "public"."Education" TO "service_role";



GRANT ALL ON TABLE "public"."Experience" TO "anon";
GRANT ALL ON TABLE "public"."Experience" TO "authenticated";
GRANT ALL ON TABLE "public"."Experience" TO "service_role";



GRANT ALL ON TABLE "public"."Industry" TO "anon";
GRANT ALL ON TABLE "public"."Industry" TO "authenticated";
GRANT ALL ON TABLE "public"."Industry" TO "service_role";



GRANT ALL ON TABLE "public"."_CandidateToIndustry" TO "anon";
GRANT ALL ON TABLE "public"."_CandidateToIndustry" TO "authenticated";
GRANT ALL ON TABLE "public"."_CandidateToIndustry" TO "service_role";



GRANT ALL ON TABLE "public"."_prisma_migrations" TO "anon";
GRANT ALL ON TABLE "public"."_prisma_migrations" TO "authenticated";
GRANT ALL ON TABLE "public"."_prisma_migrations" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
