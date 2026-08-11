{">
    setLoading(true);
    try {
      // ... [existing fetch logic] ...
      
      // Fetch currently online users (active in last 5 minutes)
      const { data: onlineData, error: onlineErr } = await supabase
        .from('profiles')
        .select('id, full_name, email, last_seen_at')
        .gt('last_seen_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Last 5 minutes
        .order('last_seen_at', { ascending: false });

      if (onlineErr) throw onlineErr;
      setOnlineCount(onlineData.length);
      setOnlineUsers(onlineData);
      
      // ... [rest of existing fetch logic] ...
    } catch (err: any) {
      showError(err.message || "Failed to load platform analytics");
    } finally {
      setLoading(false);
    }
  };