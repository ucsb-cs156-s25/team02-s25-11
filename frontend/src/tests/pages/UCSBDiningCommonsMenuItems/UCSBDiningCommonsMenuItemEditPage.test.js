import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBDiningCommonsMenuItemEditPage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemEditPage";

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
      id: 1,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("UCSBDiningCommonsMenuItemEditPage tests", () => {
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
      axiosMock
        .onGet("/api/ucsbdiningcommonsmenuitems", { params: { id: 1 } })
        .timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonsMenuItemEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit UCSBDiningCommonsMenuItem");
      expect(
        screen.queryByTestId("UCSBDiningCommonsMenuItem-name"),
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
        .onGet("/api/ucsbdiningcommonsmenuitems", { params: { id: 1 } })
        .reply(200, {
          id: 1,
          diningCommonsCode: "Ortega",
          name: "Carnitas burrito",
          station: "Entree",
        });
      axiosMock.onPut("/api/ucsbdiningcommonsmenuitems").reply(200, {
        id: "1",
        diningCommonsCode: "ORTGA",
        name: "Steak burrito",
        station: "Special Entree",
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonsMenuItemEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("UCSBDiningCommonsMenuItemForm-id");

      const idField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-id");
      const diningCommonsCodeField = screen.getByLabelText("DiningCommonsCode");
      const nameField = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-name",
      );
      const stationField = screen.getByLabelText("Station");
      const submitButton = screen.getByText("Update");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("1");
      expect(diningCommonsCodeField).toBeInTheDocument();
      expect(diningCommonsCodeField).toHaveValue("Ortega");
      expect(nameField).toBeInTheDocument();
      expect(nameField).toHaveValue("Carnitas burrito");
      expect(stationField).toBeInTheDocument();
      expect(stationField).toHaveValue("Entree");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(diningCommonsCodeField, {
        target: { value: "ORTGA" },
      });
      fireEvent.change(nameField, {
        target: { value: "Steak burrito" },
      });
      fireEvent.change(stationField, {
        target: { value: "Special Entree" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "ucsbDiningCommonsMenuItem Updated - id: 1 name: Steak burrito",
      );

      expect(mockNavigate).toBeCalledWith({
        to: "/ucsbdiningcommonsmenuitems",
      });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 1 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          diningCommonsCode: "ORTGA",
          name: "Steak burrito",
          station: "Special Entree",
        }),
      ); // posted object
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonsMenuItemEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("UCSBDiningCommonsMenuItemForm-id");

      const idField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-id");
      const diningCommonsCodeField = screen.getByLabelText("DiningCommonsCode");
      const nameField = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-name",
      );
      const stationField = screen.getByLabelText("Station");
      const submitButton = screen.getByText("Update");

      expect(idField).toHaveValue("1");
      expect(diningCommonsCodeField).toHaveValue("Ortega");
      expect(nameField).toHaveValue("Carnitas burrito");
      expect(stationField).toHaveValue("Entree");
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(diningCommonsCodeField, { target: { value: "ORTGA" } });
      fireEvent.change(nameField, {
        target: { value: "Steak burrito" },
      });
      fireEvent.change(stationField, { target: { value: "Special Entree" } });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "ucsbDiningCommonsMenuItem Updated - id: 1 name: Steak burrito",
      );
      expect(mockNavigate).toBeCalledWith({
        to: "/ucsbdiningcommonsmenuitems",
      });
    });
  });
});
