import React from "react";
import { useBackend } from "main/utils/useBackend";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBOrganizationTable from "main/components/UCSBOrganizations/UCSBOrganizationTable";
import { useCurrentUser, hasRole } from "main/utils/currentUser";
import { Button } from "react-bootstrap";

export default function UCSBOrganizationIndexPage() {
  const currentUser = useCurrentUser();

  const {
    data: ucsborganizations,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/ucsborganizations/all"],
    { method: "GET", url: "/api/ucsborganizations/all" },
    // Stryker disable next-line all : don't test default value of empty list
    [],
  );

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
      return (
        <Button
          variant="primary"
          href="/ucsborganizations/create"
          style={{ float: "right" }}
        >
          Create ucsborganizations
        </Button>
      );
    }
  };

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>UCSBOrganization</h1>
        <UCSBOrganizationTable
          ucsborganizations={ucsborganizations}
          currentUser={currentUser}
        />
      </div>
    </BasicLayout>
  );
}
