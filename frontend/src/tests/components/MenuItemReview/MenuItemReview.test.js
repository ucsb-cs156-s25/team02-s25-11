import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("MenuItemReview tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "Item id",
    "Reviewer Email",
    "Stars",
    "Date Reviewed",
    "Comments",
  ];
  const testId = "MenuItemReview";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm
            initialContents={menuItemReviewFixtures.oneMenuItemReview}
          />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
    expect(screen.getByText(`Id`)).toBeInTheDocument();

    expect(await screen.findByTestId(`${testId}-itemId`)).toBeInTheDocument();
    expect(screen.getByText(`Item id`)).toBeInTheDocument();

    expect(
      await screen.findByTestId(`${testId}-reviewerEmail`),
    ).toBeInTheDocument();
    expect(screen.getByText(`Reviewer Email`)).toBeInTheDocument();

    expect(await screen.findByTestId(`${testId}-stars`)).toBeInTheDocument();
    expect(screen.getByText(`Stars`)).toBeInTheDocument();

    expect(
      await screen.findByTestId(`${testId}-datereviewed`),
    ).toBeInTheDocument();
    expect(screen.getByText(`Date Reviewed`)).toBeInTheDocument();

    expect(await screen.findByTestId(`${testId}-comments`)).toBeInTheDocument();
    expect(screen.getByText(`Comments`)).toBeInTheDocument();

    expect(screen.getByLabelText("Id")).toHaveValue(
      String(menuItemReviewFixtures.oneMenuItemReview.id),
    );
    expect(screen.getByLabelText("Item id")).toHaveValue(
      String(menuItemReviewFixtures.oneMenuItemReview.itemid),
    );
    expect(screen.getByLabelText("Reviewer Email")).toHaveValue(
      String(menuItemReviewFixtures.oneMenuItemReview.revieweremail),
    );
    expect(screen.getByLabelText("Stars")).toHaveValue(
      String(menuItemReviewFixtures.oneMenuItemReview.stars),
    );
    expect(screen.getByLabelText("Comments")).toHaveValue(
      String(menuItemReviewFixtures.oneMenuItemReview.comments),
    );
    expect(screen.getByLabelText("Date Reviewed")).toHaveValue(
      menuItemReviewFixtures.oneMenuItemReview.datereviewed,
    );
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm />
        </Router>
      </QueryClientProvider>,
    );
    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/Item id is required/);
    expect(screen.getByText(/Reviewer email is required/)).toBeInTheDocument();
    expect(screen.getByText(/Stars are required/)).toBeInTheDocument();
    expect(screen.getByText(/Date Reviewed is required/)).toBeInTheDocument();
    expect(screen.getByText(/Comments are required/)).toBeInTheDocument();

    const itemIdInput = screen.getByTestId(`${testId}-itemId`);
    fireEvent.change(itemIdInput, { target: { value: "a".repeat(31) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Max length 30 characters./)).toBeInTheDocument();
    });

    const starInput = screen.getByTestId(`${testId}-stars`);
    fireEvent.change(starInput, { target: { value: "7" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Stars must be within the range of 1-5./),
      ).toBeInTheDocument();
    });

    const starInputEmpty = screen.getByTestId(`${testId}-stars`);
    fireEvent.change(starInputEmpty, { target: { value: "" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Stars are required/)).toBeInTheDocument();
    });

    const emailInput = screen.getByTestId(`${testId}-comments`);
    fireEvent.change(emailInput, { target: { value: "a".repeat(256) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Max length 255 characters./),
      ).toBeInTheDocument();
    });
  });
});
