import { useState, useEffect, useCallback } from "react";
import { getWorkouts, getPosts, getUserStats } from "../api/fitness";

export const useWorkouts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      const res = await getWorkouts();
      setData(res);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, refetch: fetch };
};

export const usePosts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      const res = await getPosts();
      setData(res);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, refetch: fetch };
};
