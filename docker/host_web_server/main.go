package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
)

func main() {
	m := http.NewServeMux()

	m.HandleFunc("/", handlePage)

	fmt.Printf("PORT IS %s.\n", os.Getenv("PORT"))

	const addr = ":8080"
	srv := http.Server{
		Handler:      m,
		Addr:         addr,
		WriteTimeout: 30 * time.Second,
		ReadTimeout:  30 * time.Second,
	}

	// this blocks forever, until the server
	// has an unrecoverable error
	fmt.Println("server started on ", addr)
	err := srv.ListenAndServe()
	log.Fatal(err)
}

func handlePage(w http.ResponseWriter, r *http.Request) {
	// Get the PORT environment variable
	port := os.Getenv("PORT")

	// If PORT is not set, use a default value
	if port == "" {
		port = "not set"
	}

	// Create the HTML content with the PORT value
	page := fmt.Sprintf(`<html>
<head></head>
<body>
	<p>Hello from Docker! I'm a Go server running on port %s.</p>
</body>
</html>`, port)

	// Set the content type and write the HTML content
	w.Header().Set("Content-Type", "text/html")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(page))
}
