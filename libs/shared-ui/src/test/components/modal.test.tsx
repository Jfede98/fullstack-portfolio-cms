import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { Modal } from "@shared-ui/components/modal";

describe("Modal component", () => {
  it("does not render when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()}>
        Modal content
      </Modal>
    );

    const dialog = screen.queryByRole("dialog");
    expect(dialog).to.equal(null);
  });

  it("renders modal content when isOpen is true", () => {
    render(
      <Modal isOpen onClose={vi.fn()}>
        <div data-testid="modal-content">Hello modal</div>
      </Modal>
    );

    const dialog = screen.getByRole("dialog");
    const content = screen.getByTestId("modal-content");

    expect(dialog).to.exist;
    expect(content.textContent).to.equal("Hello modal");
  });

  it("calls onClose when clicking on overlay", () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen onClose={onClose}>
        Modal body
      </Modal>
    );

    const dialog = screen.getByRole("dialog");
    const overlay = dialog.parentElement as HTMLElement;

    fireEvent.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when clicking inside modal content", () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen onClose={onClose}>
        <div data-testid="inside">Inside</div>
      </Modal>
    );

    fireEvent.click(screen.getByTestId("inside"));

    expect(onClose).toHaveBeenCalledTimes(0);
  });

  it("renders close button by default", () => {
    render(
      <Modal isOpen onClose={vi.fn()}>
        Modal content
      </Modal>
    );

    const closeButton = screen.getByRole("button");
    expect(closeButton).to.exist;
  });

  it("does not render close button when showCloseButton is false", () => {
    render(
      <Modal isOpen onClose={vi.fn()} showCloseButton={false}>
        Modal content
      </Modal>
    );

    const closeButton = screen.queryByRole("button");
    expect(closeButton).to.equal(null);
  });

  it("applies custom className styles", () => {
    render(
      <Modal
        isOpen
        onClose={vi.fn()}
        className={{
          overlay: "custom-overlay",
          base: "custom-content",
          body: "custom-body"
        }}
      >
        <div data-testid="body">Body</div>
      </Modal>
    );

    const dialog = screen.getByRole("dialog");
    const overlay = dialog.parentElement as HTMLElement;
    const body = screen.getByTestId("body").parentElement as HTMLElement;

    expect(overlay.className).to.include("custom-overlay");
    expect(dialog.className).to.include("custom-content");
    expect(body.className).to.include("custom-body");
  });

  it("applies size variant", () => {
    render(
      <Modal isOpen size="lg" onClose={vi.fn()}>
        Modal content
      </Modal>
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog.className.length).to.be.greaterThan(0);
  });
});
