import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import MenuItemReviewTable from "main/components/MenuItemReview/MenuItemReviewTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("MenuItemReviewTable tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "id",
    "Item id",
    "Reviewer Email",
    "Stars",
    "Comments",
    "Date Reviewed",
  ];
  const expectedFields = [
    "id",
    "itemid",
    "revieweremail",
    "stars",
    "comments",
    "datereviewed",
  ];
  const testId = "MenuItemReviewTable";

  test("renders empty table correctly", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewTable menuItemReviews={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const fieldElement = screen.queryByTestId(
        `${testId}-cell-row-0-col-${field}`,
      );
      expect(fieldElement).not.toBeInTheDocument();
    });
  });

  test("Has the expected column headers, content and buttons for admin user", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewTable
            menuItemReviews={menuItemReviewFixtures.threeMenuItemReview}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "2",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-itemid`),
    ).toHaveTextContent("2");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-revieweremail`),
    ).toHaveTextContent("2345@ucsb.edu");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-stars`),
    ).toHaveTextContent("5");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-comments`),
    ).toHaveTextContent("delicious");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-datereviewed`),
    ).toHaveTextContent("2025-01-01T00:00");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "3",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-itemid`),
    ).toHaveTextContent("3");

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-revieweremail`),
    ).toHaveTextContent("7643@ucsb.edu");

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-stars`),
    ).toHaveTextContent("1");

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-comments`),
    ).toHaveTextContent("bad");

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-datereviewed`),
    ).toHaveTextContent("2025-01-01T00:00");

    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent(
      "4",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-itemid`),
    ).toHaveTextContent("4");

    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-revieweremail`),
    ).toHaveTextContent("654@ucsb.edu");

    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-stars`),
    ).toHaveTextContent("3");

    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-comments`),
    ).toHaveTextContent("okay");

    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-datereviewed`),
    ).toHaveTextContent("2025-01-01T00:00");

    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");
  });

  test("Has the expected column headers, content for ordinary user", () => {
    // arrange
    const currentUser = currentUserFixtures.userOnly;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewTable
            menuItemReviews={menuItemReviewFixtures.threeMenuItemReview}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "2",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-itemid`),
    ).toHaveTextContent("2");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-revieweremail`),
    ).toHaveTextContent("2345@ucsb.edu");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-stars`),
    ).toHaveTextContent("5");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-comments`),
    ).toHaveTextContent("delicious");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-datereviewed`),
    ).toHaveTextContent("2025-01-01T00:00");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "3",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-itemid`),
    ).toHaveTextContent("3");

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-revieweremail`),
    ).toHaveTextContent("7643@ucsb.edu");

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-stars`),
    ).toHaveTextContent("1");

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-comments`),
    ).toHaveTextContent("bad");

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-datereviewed`),
    ).toHaveTextContent("2025-01-01T00:00");

    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent(
      "4",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-itemid`),
    ).toHaveTextContent("4");

    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-revieweremail`),
    ).toHaveTextContent("654@ucsb.edu");

    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-stars`),
    ).toHaveTextContent("3");

    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-comments`),
    ).toHaveTextContent("okay");

    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-datereviewed`),
    ).toHaveTextContent("2025-01-01T00:00");

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });

  test("Edit button navigates to the edit page", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewTable
            menuItemReviews={menuItemReviewFixtures.threeMenuItemReview}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert - check that the expected content is rendered
    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "2",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-itemid`),
    ).toHaveTextContent("2");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-revieweremail`),
    ).toHaveTextContent("2345@ucsb.edu");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-stars`),
    ).toHaveTextContent("5");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-comments`),
    ).toHaveTextContent("delicious");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-datereviewed`),
    ).toHaveTextContent("2025-01-01T00:00");

    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).toBeInTheDocument();

    // act - click the edit button
    fireEvent.click(editButton);

    // assert - check that the navigate function was called with the expected path
    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith("/menuitemreview/edit/2"),
    );
  });

  test("Delete button calls delete callback", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock
      .onDelete("/api/menuitemreview")
      .reply(200, { message: "Menu item review deleted" });

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewTable
            menuItemReviews={menuItemReviewFixtures.threeMenuItemReview}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert - check that the expected content is rendered
    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "2",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-itemid`),
    ).toHaveTextContent("2");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-revieweremail`),
    ).toHaveTextContent("2345@ucsb.edu");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-stars`),
    ).toHaveTextContent("5");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-comments`),
    ).toHaveTextContent("delicious");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-datereviewed`),
    ).toHaveTextContent("2025-01-01T00:00");

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();

    // act - click the delete button
    fireEvent.click(deleteButton);

    // assert - check that the delete endpoint was called

    await waitFor(() => expect(axiosMock.history.delete.length).toBe(1));
    expect(axiosMock.history.delete[0].params).toEqual({ id: 2 });
  });
});
