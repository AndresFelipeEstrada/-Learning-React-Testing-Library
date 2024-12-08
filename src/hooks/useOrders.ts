import { useCallback, useEffect, useState } from "react";
import { useSession } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../services/getOrders";
import { Order } from "../types/Orders";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
      setError(null);
    } catch (e: unknown) {
      setError("Failed to fetch orders. Please try again later.");
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchOrders();
  }, [fetchOrders, user]);

  return {
    orders,
    loading,
    error,
    user,
  };
}