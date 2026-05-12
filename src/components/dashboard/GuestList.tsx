const handleExportCSV = () => {
    if (rsvps.length === 0) {
      showError("No guests to export.");
      return;
    }

    // Enhanced CSV with all relevant columns
    const headers = [
      "Guest ID",
      "Guest Name", 
      "Phone",
      "Status",
      "Table Number",
      "Plus One",
      "Song Request",
      "RSVP Date",
      "Checked In"
    ];

    const rows = rsvps.map(r => [
      r.id,
      r.guest_name,
      r.guest_phone,
      r.checked_in ? "Checked-in" : "Pending",
      r.table_number || "N/A",
      r.has_plus_one ? "Yes" : "No",
      r.song_request || "None",
      new Date(r.created_at).toLocaleDateString(),
      r.checked_in ? "Yes" : "No"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `GuestList_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess("Guest list exported successfully.");
  };