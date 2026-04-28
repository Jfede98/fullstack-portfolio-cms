import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TextField } from "@shared-ui/components/textField";

describe("TextField component", () => {
  describe("Basic functionality", () => {
    it("renders with label", () => {
      render(<TextField label="Email" />);
      expect(screen.getByText("Email")).toBeDefined();
    });

    it("renders with placeholder", () => {
      render(<TextField label="Email" placeholder="Enter your email" />);
      const input = screen.getByPlaceholderText("Enter your email");
      expect(input).toBeDefined();
    });

    it("renders with error message", () => {
      render(<TextField label="Email" error="This field is required" />);
      expect(screen.getByText("This field is required")).toBeDefined();
    });

    it("renders with helper text", () => {
      render(<TextField label="Email" helperText="We'll never share your email" />);
      expect(screen.getByText("We'll never share your email")).toBeDefined();
    });

    it("hides label visually when hiddenLabel is true", () => {
      const { container } = render(<TextField label="Email" hiddenLabel />);
      const label = container.querySelector("label");
      expect(label?.className).toContain("sr-only");
    });

    it("applies disabled state", () => {
      render(<TextField label="Email" disabled />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveProperty("disabled", true);
    });

    it("shows required asterisk only when explicitly enabled for regular input", () => {
      const { rerender } = render(
        <TextField label="Email" required />
      );
      expect(screen.queryByText("*")).toBeNull();

      rerender(<TextField label="Email" required showRequiredAsterisk />);
      expect(screen.getByText("*")).toBeDefined();
    });

    it("applies custom required asterisk class", () => {
      const { container } = render(
        <TextField
          label="Email"
          required
          showRequiredAsterisk
          requiredAsteriskClassName="text-[#DD3939]"
        />
      );
      const mark = container.querySelector(".text-\\[\\#DD3939\\]");
      expect(mark).toBeDefined();
    });
  });

  describe("Icon functionality", () => {
    it("renders with icon", () => {
      render(<TextField label="Email" icon="email" />);
      // El componente Icon renderiza un <span> con el nombre del icono como texto
      expect(screen.queryByText("email")).not.toBeNull();
    });

    it("applies correct padding when icon is present", () => {
      const { container } = render(<TextField label="Email" icon="email" />);
      const input = container.querySelector("input");
      expect(input?.className).toContain("pl-12");
    });
  });

  describe("Custom className", () => {
    it("applies custom className to base", () => {
      const { container } = render(
        <TextField label="Email" className={{ base: "custom-input" }} />
      );
      const input = container.querySelector("input");
      expect(input?.className).toContain("custom-input");
    });

    it("applies custom className to label", () => {
      const { container } = render(
        <TextField label="Email" className={{ label: "custom-label" }} />
      );
      const label = container.querySelector("label span");
      expect(label?.className).toContain("custom-label");
    });
  });

  describe("Combobox variant", () => {
    const mockOptions = [
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2" },
      { value: "3", label: "Option 3" }
    ];

    it("renders with combobox styles", () => {
      const { container } = render(
        <TextField label="City" placeholder="Select" combobox options={mockOptions} />
      );
      const input = container.querySelector("input");
      expect(input?.className).toContain("cursor-pointer");
      expect(input?.className).toContain("pr-12");
    });

    it("shows arrow icon when combobox is true", () => {
      render(
        <TextField label="City" combobox options={mockOptions} />
      );
      // El componente Icon renderiza un <span> con el nombre del icono como texto
      expect(screen.queryByText("keyboard_arrow_down")).not.toBeNull();
    });

    it("is readOnly when combobox is true", () => {
      render(<TextField label="City" combobox options={mockOptions} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveProperty("readOnly", true);
    });

    it("works with icon and combobox together", () => {
      const { container } = render(
        <TextField label="City" icon="location_on" combobox options={mockOptions} />
      );
      const input = container.querySelector("input");
      expect(input?.className).toContain("pl-12"); // icon izquierdo
      expect(input?.className).toContain("pr-12"); // flecha derecha
    });

    it("opens dropdown when clicked", async () => {
      render(
        <TextField label="City" combobox options={mockOptions} />
      );
      const input = screen.getByRole("textbox");

      fireEvent.click(input);

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeDefined();
        expect(screen.getByText("Option 2")).toBeDefined();
        expect(screen.getByText("Option 3")).toBeDefined();
      });
    });

    it("calls onSelectOption when option is clicked", async () => {
      const onSelectOption = vi.fn();
      render(
        <TextField
          label="City"
          combobox
          options={mockOptions}
          onSelectOption={onSelectOption}
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.click(input);

      await waitFor(() => {
        const option = screen.getByText("Option 2");
        fireEvent.click(option);
      });

      expect(onSelectOption).toHaveBeenCalledWith("2");
    });

    it("displays selected option label", () => {
      render(
        <TextField
          label="City"
          combobox
          options={mockOptions}
          value="2"
        />
      );

      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toBe("Option 2");
    });

    it("shows search input when searchable is true", async () => {
      render(
        <TextField
          label="City"
          combobox
          searchable
          options={mockOptions}
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.click(input);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Buscar...")).toBeDefined();
      });
    });

    it("filters options based on search", async () => {
      render(
        <TextField
          label="City"
          combobox
          searchable
          options={mockOptions}
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.click(input);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText("Buscar...");
        fireEvent.change(searchInput, { target: { value: "Option 1" } });
      });

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeDefined();
        expect(screen.queryByText("Option 2")).toBeNull();
      });
    });

    it("shows empty state when no options match search", async () => {
      render(
        <TextField
          label="City"
          combobox
          searchable
          options={mockOptions}
          emptyText="No results found"
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.click(input);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText("Buscar...");
        fireEvent.change(searchInput, { target: { value: "nonexistent" } });
      });

      await waitFor(() => {
        expect(screen.getByText("No results found")).toBeDefined();
      });
    });

    it("does not allow selection of disabled options", async () => {
      const onSelectOption = vi.fn();
      const optionsWithDisabled = [
        ...mockOptions,
        { value: "4", label: "Option 4", disabled: true }
      ];

      render(
        <TextField
          label="City"
          combobox
          options={optionsWithDisabled}
          onSelectOption={onSelectOption}
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.click(input);

      await waitFor(() => {
        const disabledOption = screen.getByText("Option 4").closest("button");
        expect(disabledOption).toHaveProperty("disabled", true);
      });
    });

    it("closes dropdown when clicking outside", async () => {
      render(
        <div>
          <TextField label="City" combobox options={mockOptions} />
          <div data-testid="outside">Outside</div>
        </div>
      );

      const input = screen.getByRole("textbox");
      fireEvent.click(input);

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeDefined();
      });

      const outside = screen.getByTestId("outside");
      fireEvent.mouseDown(outside);

      await waitFor(() => {
        expect(screen.queryByText("Option 1")).toBeNull();
      });
    });

    it("shows spinner when loadingOptions is true", async () => {
      render(
        <TextField
          label="City"
          combobox
          options={[]}
          loadingOptions
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.click(input);

      await waitFor(() => {
        expect(screen.getByText("Buscando...")).toBeDefined();
      });
    });

    it("does not show options while loadingOptions is true", async () => {
      const mockOptions = [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" },
        { value: "3", label: "Option 3" }
      ];

      render(
        <TextField
          label="City"
          combobox
          options={mockOptions}
          loadingOptions
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.click(input);

      await waitFor(() => {
        expect(screen.queryByText("Option 1")).toBeNull();
        expect(screen.getByText("Buscando...")).toBeDefined();
      });
    });
  });

  describe("Autocomplete (onSearchChange)", () => {
    const mockOptions = [
      { value: "addr-1", label: "Av. República 123" },
      { value: "addr-2", label: "Calle 10 de Agosto 456" },
    ];

    it("is editable when onSearchChange is provided", () => {
      render(
        <TextField
          label="Address"
          combobox
          options={mockOptions}
          onSearchChange={vi.fn()}
        />
      );
      const input = screen.getByRole("textbox");
      expect(input).not.toHaveProperty("readOnly", true);
    });

    it("calls onSearchChange when typing", async () => {
      const onSearchChange = vi.fn();
      render(
        <TextField
          label="Address"
          combobox
          options={[]}
          onSearchChange={onSearchChange}
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "Av. Rep" } });

      await waitFor(() => {
        expect(onSearchChange).toHaveBeenCalledWith("Av. Rep");
      });
    });

    it("calls onSearchChange with empty string when input is cleared", async () => {
      const onSearchChange = vi.fn();
      render(
        <TextField
          label="Address"
          combobox
          options={[]}
          onSearchChange={onSearchChange}
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "something" } });
      fireEvent.change(input, { target: { value: "" } });

      await waitFor(() => {
        expect(onSearchChange).toHaveBeenLastCalledWith("");
      });
    });

    it("closes dropdown and clears aria-expanded when input is cleared", async () => {
      const onSearchChange = vi.fn();
      render(
        <TextField
          label="Address"
          combobox
          options={[]}
          onSearchChange={onSearchChange}
        />
      );

      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "x" } });
      await waitFor(() => expect(input.getAttribute("aria-expanded")).toBe("true"));

      fireEvent.change(input, { target: { value: "" } });

      await waitFor(() => {
        expect(onSearchChange).toHaveBeenLastCalledWith("");
        expect(input.getAttribute("aria-expanded")).toBe("false");
      });
    });

    it("shows emptyText when there is input text but no results", async () => {
      render(
        <TextField
          label="Address"
          combobox
          options={[]}
          onSearchChange={vi.fn()}
          emptyText="No results found"
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "xyz" } });

      await waitFor(() => {
        expect(screen.getByText("No results found")).toBeDefined();
      });
    });

    it("displays options returned by the search", async () => {
      render(
        <TextField
          label="Address"
          combobox
          options={mockOptions}
          onSearchChange={vi.fn()}
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "Av" } });

      await waitFor(() => {
        expect(screen.getByText("Av. República 123")).toBeDefined();
        expect(screen.getByText("Calle 10 de Agosto 456")).toBeDefined();
      });
    });

    it("selects an option and writes its label into the input", async () => {
      const onSelectOption = vi.fn();
      render(
        <TextField
          label="Address"
          combobox
          options={mockOptions}
          onSearchChange={vi.fn()}
          onSelectOption={onSelectOption}
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "Av" } });

      await waitFor(() => {
        fireEvent.click(screen.getByText("Av. República 123"));
      });

      expect(onSelectOption).toHaveBeenCalledWith("addr-1");
      expect((input as HTMLInputElement).value).toBe("Av. República 123");
    });

    it("does not show internal search input in autocomplete mode", async () => {
      render(
        <TextField
          label="Address"
          combobox
          searchable
          options={mockOptions}
          onSearchChange={vi.fn()}
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "Av" } });

      await waitFor(() => {
        expect(screen.queryByPlaceholderText("Buscar...")).toBeNull();
      });
    });
  });

  describe("Accessibility", () => {
    it("sets aria-invalid when error is present", () => {
      render(<TextField label="Email" error="Invalid email" />);
      const input = screen.getByRole("textbox");
      expect(input.getAttribute("aria-invalid")).toBe("true");
    });

    it("links error message with aria-describedby", () => {
      render(<TextField label="Email" error="Invalid email" />);
      const input = screen.getByRole("textbox");
      const ariaDescribedBy = input.getAttribute("aria-describedby");
      expect(ariaDescribedBy).toBeTruthy();
      expect(screen.getByText("Invalid email")).toBeDefined();
    });

    it("associates label with input", () => {
      const { container } = render(<TextField label="Email" />);
      const input = screen.getByRole("textbox");
      const label = container.querySelector("label");

      expect(input.id).toBeTruthy();
      expect(label?.getAttribute("for")).toBe(input.id);
    });
  });
});

