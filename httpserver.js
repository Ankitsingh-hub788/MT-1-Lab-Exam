
import http from "http";
import fs from "fs";

let foods = [
    { id: 1, foodName: "Pizza", category: "Fast Food", price: 250, availability: true },
    { id: 2, foodName: "Burger", category: "Fast Food", price: 120, availability: true },
    { id: 3, foodName: "Pasta", category: "Italian", price: 180, availability: false }
];

const server = http.createServer((req, res) => {

    const { method, url } = req;

    res.setHeader("Content-Type", "application/json");

    if (method === "GET" && url === "/") {
        res.writeHead(200, { "Content-Type": "text/html" });
        return res.end("<h1>Welcome to Online Food Ordering</h1>");
    }

    if (method === "GET" && url === "/foods") {
        return res.end(JSON.stringify(
            foods.filter(food => food.availability === true)
        ));
    }

    if (method === "GET" && url === "/about") {
        return res.end(JSON.stringify({
            restaurant: "Food Ordering Restaurant",
            location: "Ghaziabad"
        }));
    }

    if (method === "GET" && url === "/menu") {
        return fs.readFile("./public/menu.html", (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end("Internal Server Error");
            }

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(data);
        });
    }

    if (method === "POST" && url === "/add-food") {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const food = JSON.parse(body);

                if (
                    food.id === undefined ||
                    !food.foodName ||
                    !food.category ||
                    typeof food.price !== "number" ||
                    food.price <= 0 ||
                    typeof food.availability !== "boolean"
                ) {
                    res.writeHead(400);
                    return res.end(JSON.stringify({
                        message: "Invalid food details"
                    }));
                }

                foods.push(food);

                res.writeHead(201);
                res.end(JSON.stringify({
                    message: "Food added successfully",
                    food: food
                }));

            } catch {
                res.writeHead(400);
                res.end(JSON.stringify({
                    message: "Invalid JSON"
                }));
            }
        });

        return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({
        message: "Route Not Found"
    }));

});

server.listen(3000, () => {
    console.log("HTTP Server running at http://localhost:3000");
});
