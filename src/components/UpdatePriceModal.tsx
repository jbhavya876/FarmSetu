import { useState } from "react";
import type { FormEvent } from "react";
import type { FarmSetuForwardContract, UpdatePriceInput } from "../types/contract";

interface UpdatePriceModalProps {
  contract: FarmSetuForwardContract;
  onUpdatePrice: (input: UpdatePriceInput) => Promise<void>;
  onClose: () => void;
}

function UpdatePriceModal({ contract, onUpdatePrice, onClose }: UpdatePriceModalProps) {
  const [currentPrice, setCurrentPrice] = useState<number>(contract.current_price);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!Number.isFinite(currentPrice) || currentPrice <= 0) {
      setError("Current price must be greater than 0.");
      return;
    }

    setIsLoading(true);
    try {
      await onUpdatePrice({
        contractId: contract.appId,
        currentPrice,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="grid min-h-full place-items-center">
        <div className="fs-card w-full max-w-md rounded-2xl p-6">
          <h2 className="text-2xl font-extrabold text-slate-900">Update Oracle Price</h2>

          <div className="mt-4 rounded-xl border border-green-100 bg-green-50 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Contract:</span>
              <span className="font-semibold">#{contract.appId}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-slate-600">Crop:</span>
              <span className="font-semibold">{contract.crop_name}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-slate-600">Current On-chain Price:</span>
              <span className="font-semibold">{contract.current_price} ALGO</span>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="fs-label">New Current Price (ALGO)</label>
              <input
                type="number"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                className="fs-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={onClose} className="fs-btn fs-btn-secondary px-4 py-2.5 text-sm">
                Cancel
              </button>
              <button type="submit" disabled={isLoading} className="fs-btn fs-btn-primary px-4 py-2.5 text-sm">
                {isLoading ? "Updating..." : "Update Price"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdatePriceModal;
