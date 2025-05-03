import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

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

describe("ArticlesEditPage tests", () => {
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
      axiosMock.onGet("/api/articles", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Article");
      expect(screen.queryByTestId("Article-title")).not.toBeInTheDocument();
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
      axiosMock.onGet("/api/articles", { params: { id: 17 } }).reply(200, {
        id: 17,
        title: "add table",
        url: "https://github.com/ucsb-cs156-s25/team02-s25-11/commit/525f9901430a9c435377f833b166147fa6c04e61",
        explanation: "add UCSBDiningCommonsMenuItemTable, tests, and stories",
        email: "saul_diaz@ucsb.edu",
        dateAdded: "2025-05-01T02:22:14.637",
      });
      axiosMock.onPut("/api/articles").reply(200, {
        id: 17,
        title: "edit table",
        url: "https://github.com/ucsb-cs156-s25/team02-s25-11",
        explanation: "edit page",
        email: "shuang_li@ucsb.edu",
        dateAdded: "2025-05-02T09:11:14.637",

      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided, and changes whtn data is changed", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("ArticlesForm-id");

      const idField = screen.getByTestId("ArticlesForm-id");
      const titleField = screen.getByTestId("ArticlesForm-title");
      const urlField = screen.getByLabelText("Url");
      const explanationField = screen.getByLabelText("Explanation");
      const emailField = screen.getByLabelText("Email");
      const dateAddedField = screen.getByLabelText("DateAdded (iso format)");

      const submitButton = screen.getByText("Update");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");

      expect(titleField).toBeInTheDocument();
      expect(titleField).toHaveValue("add table");

      expect(urlField).toBeInTheDocument();
      expect(urlField).toHaveValue("https://github.com/ucsb-cs156-s25/team02-s25-11/commit/525f9901430a9c435377f833b166147fa6c04e61");

      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("add UCSBDiningCommonsMenuItemTable, tests, and stories");

      expect(emailField).toBeInTheDocument();
      expect(emailField).toHaveValue("saul_diaz@ucsb.edu");

      expect(dateAddedField).toBeInTheDocument();
      expect(dateAddedField).toHaveValue("2025-05-01T02:22:14.637");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(titleField, {
        target: { value: "edit table" },
      });
      fireEvent.change(urlField, {
        target: { value: "https://github.com/ucsb-cs156-s25/team02-s25-11" },
      });
      fireEvent.change(explanationField, {
        target: { value: "edit page" },
      });
      fireEvent.change(emailField, {
        target: { value: "shuang_li@ucsb.edu" },
      });
      fireEvent.change(dateAddedField, {
        target: { value: "2025-05-02T09:11:14.637" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Article Updated - id: 17 title: edit table",
      );

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/articles" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          title: "edit table",
          url: "https://github.com/ucsb-cs156-s25/team02-s25-11",
          explanation: "edit page",
          email: "shuang_li@ucsb.edu",
          dateAdded: "2025-05-02T09:11:14.637",
        }),
      ); // posted object
    });

  //   test("Changes when you click Update", async () => {
  //     render(
  //       <QueryClientProvider client={queryClient}>
  //         <MemoryRouter>
  //           <ArticlesEditPage />
  //         </MemoryRouter>
  //       </QueryClientProvider>,
  //     );

  //     await screen.findByTestId("ArticlesForm-id");

  //     const idField = screen.getByTestId("ArticlesForm-id");
  //     const titleField = screen.getByTestId("ArticlesForm-title");
  //     const urlField = screen.getByLabelText("Url");
  //     const explanationField = screen.getByLabelText("Explanation");
  //     const emailField = screen.getByLabelText("Email");
  //     const dateAddedField = screen.getByLabelText("DateAdded");

  //     const submitButton = screen.getByText("update");

  //     expect(idField).toBeInTheDocument();
  //     expect(idField).toHaveValue("17");

  //     expect(titleField).toBeInTheDocument();
  //     expect(titleField).toHaveValue("add table");

  //     expect(urlField).toBeInTheDocument();
  //     expect(urlField).toHaveValue("https://github.com/ucsb-cs156-s25/team02-s25-11/commit/525f9901430a9c435377f833b166147fa6c04e61");

  //     expect(explanationField).toBeInTheDocument();
  //     expect(explanationField).toHaveValue("add UCSBDiningCommonsMenuItemTable, tests, and stories");

  //     expect(emailField).toBeInTheDocument();
  //     expect(emailField).toHaveValue("saul_diaz@ucsb.edu");

  //     expect(dateAddedField).toBeInTheDocument();
  //     expect(dateAddedField).toHaveValue("2025-05-01T02:22:14.637");

  //     expect(submitButton).toHaveTextContent("Update");

  //     fireEvent.change(nameField, {
  //       target: { value: "Freebirds World Burrito" },
  //     });
  //     fireEvent.change(descriptionField, { target: { value: "Big Burritos" } });

  //     fireEvent.click(submitButton);

  //     await waitFor(() => expect(mockToast).toBeCalled());
  //     expect(mockToast).toHaveBeenCalledWith(
  //       "Article Updated - id: 17 name: Freebirds World Burrito",
  //     );
  //     expect(mockNavigate).toHaveBeenCalledWith({ to: "/articles" });
  //   });
  });
});
