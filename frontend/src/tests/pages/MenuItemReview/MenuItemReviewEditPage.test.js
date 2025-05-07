import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useParams: () => ({
      id: 17,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("MenuItemReviewEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/menuitemreviews", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but review is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Menu Item Review");
      expect(
        screen.queryByTestId("MenuItemReview-itemId"),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/menuitemreviews", { params: { id: 17 } })
        .reply(200, {
          id: 17,
          itemid: 1,
          revieweremail: "7432@ucsb.edu",
          stars: 4,
          comments: "good",
          datereviewed: "2025-01-01T00:00",
        });
      axiosMock.onPut("/api/menuitemreviews").reply(200, {
        id: 17,
        itemid: 2,
        revieweremail: "new@ucsb.edu",
        stars: 1,
        comments: "updated",
        datereviewed: "2025-01-02T00:00",
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReview-id");

      const idField = screen.getByTestId("MenuItemReview-id");
      const itemidField = screen.getByTestId("MenuItemReview-itemId");
      const commentsField = screen.getByTestId("MenuItemReview-comments");
      const starField = screen.getByTestId("MenuItemReview-stars");
      const dateField = screen.getByTestId("MenuItemReview-datereviewed");
      const emailField = screen.getByTestId("MenuItemReview-reviewerEmail");
      const submitButton = screen.getByTestId("MenuItemReview-submit");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(itemidField).toBeInTheDocument();
      expect(itemidField).toHaveValue("1");
      expect(commentsField).toBeInTheDocument();
      expect(commentsField).toHaveValue("good");
      expect(starField).toBeInTheDocument();
      expect(starField).toHaveValue("4");
      expect(dateField).toBeInTheDocument();
      expect(dateField).toHaveValue("2025-01-01T00:00");
      expect(emailField).toBeInTheDocument();
      expect(emailField).toHaveValue("7432@ucsb.edu");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(itemidField, {
        target: { value: "2" },
      });
      fireEvent.change(commentsField, {
        target: { value: "updated" },
      });
      fireEvent.change(emailField, {
        target: { value: "new@ucsb.edu" },
      });
      fireEvent.change(dateField, {
        target: { value: "2025-01-02T00:00" },
      });
      fireEvent.change(starField, {
        target: { value: "1" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Menu Item Review Updated - id: 17 item id: 2 comments: updated reviewer email: new@ucsb.edu stars: 1 date reviewed: 2025-01-02T00:00",
      );

      expect(mockNavigate).toBeCalledWith({ to: "/menuitemreview" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          itemid: "2",
          comments: "updated",
          revieweremail: "new@ucsb.edu",
          stars: "1",
          datereviewed: "2025-01-02T00:00",
        }),
      ); // posted object
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReview-id");

      const idField = screen.getByTestId("MenuItemReview-id");
      const itemidField = screen.getByTestId("MenuItemReview-itemId");
      const commentsField = screen.getByTestId("MenuItemReview-comments");
      const starField = screen.getByTestId("MenuItemReview-stars");
      const dateField = screen.getByTestId("MenuItemReview-datereviewed");
      const emailField = screen.getByTestId("MenuItemReview-reviewerEmail");
      const submitButton = screen.getByTestId("MenuItemReview-submit");

      expect(idField).toHaveValue("17");
      expect(itemidField).toHaveValue("1");
      expect(commentsField).toHaveValue("good");
      expect(starField).toHaveValue("4");
      expect(dateField).toHaveValue("2025-01-01T00:00");
      expect(emailField).toHaveValue("7432@ucsb.edu");

      expect(submitButton).toBeInTheDocument();

      fireEvent.change(itemidField, {
        target: { value: "2" },
      });
      fireEvent.change(commentsField, { target: { value: "updated" } });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Menu Item Review Updated - id: 17 item id: 2 comments: updated reviewer email: new@ucsb.edu stars: 1 date reviewed: 2025-01-02T00:00",
      );

      expect(mockNavigate).toBeCalledWith({ to: "/menuitemreview" });
    });
  });
});
