import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../app/component/nav.js";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Neo pixel",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Sensor Data</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" />
      </head>
      <body className={inter.className}>
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
