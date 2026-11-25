ALTER POLICY "organizations_member_read" ON "organizations" TO public USING (exists (
        select 1 from organization_memberships
        where organization_memberships.organization_id = "organizations"."id"
          and organization_memberships.user_id = current_setting('vanguard.user_id', true)
      ));