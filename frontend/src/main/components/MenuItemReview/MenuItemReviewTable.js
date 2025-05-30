import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/menuItemReviewUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function MenuItemReviewTable({
  menuItemReviews,
  currentUser,
  testIdPrefix = "MenuItemReviewTable",
}) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate(`/menuitemreview/edit/${cell.row.values.id}`);
  };

  // Stryker disable all : hard to test for query caching

  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    ["/api/menuitemreviews/all"],
  );
  // Stryker restore all

  // Stryker disable next-line all : TODO try to make a good test for this
  const deleteCallback = async (cell) => {
    deleteMutation.mutate(cell);
  };

  const columns = [
    {
      Header: "id",
      accessor: "id", // accessor is the "key" in the data
    },

    {
      Header: "Item id",
      accessor: "itemid",
    },
    {
      Header: "Reviewer Email",
      accessor: "revieweremail",
    },
    {
      Header: "Stars",
      accessor: "stars",
    },
    {
      Header: "Comments",
      accessor: "comments",
    },
    {
      Header: "Date Reviewed",
      accessor: "datereviewed",
    },
  ];

  if (hasRole(currentUser, "ROLE_ADMIN")) {
    columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
    columns.push(
      ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix),
    );
  }

  return (
    <OurTable data={menuItemReviews} columns={columns} testid={testIdPrefix} />
  );
}
