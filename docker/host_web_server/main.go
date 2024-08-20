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
	// // Get the PORT environment variable
	// port := os.Getenv("PORT")

	// // If PORT is not set, use a default value
	// if port == "" {
	// 	port = "not set"
	// }

	// // Create the HTML content with the PORT value
	w.Header().Set("Content-Type", "text/html")
	w.WriteHeader(200)
	const page = `<html>
<head></head>
<body>
	<p> Hi Docker, I pushed a new version </p>
</body>
</html>
`
	w.Write([]byte(page))
}
