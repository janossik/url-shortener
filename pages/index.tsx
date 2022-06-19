import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const Home: NextPage = () => {
  const [currentUrl, setCurrentUrl] = useState("");
  const [url, setUrl] = useState("");
  const [urls, setUrls] = useState<
    {
      count: number;
      full: string;
      short: string;
    }[]
  >([]);

  useEffect(() => {
    if (urls.length > 0) return;
    fetch("/api", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        lasturl: urls.length > 0 ? urls[urls.length - 1].short : "",
      },
    })
      .then(async (response) => await response?.json())
      .then((data) => {
        setCurrentUrl(document.URL);
        setUrls(data.urls);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <main className={styles.container}>
      <Head>
        <title>URL Shortener</title>
        <meta
          name="description"
          content="A common application for shortening urls. With this page you can shorten your url."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div>
          <h1>URL Shortener</h1>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              url.length > 0 &&
                fetch("/api", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ url }),
                });

              fetch("/api", {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  lasturl: urls.length > 0 ? urls[urls.length - 1].short : "",
                },
              })
                .then(async (response) => await response?.json())
                .then((data) => {
                  setUrls((v) => [...v, ...data.urls]);
                  setUrl("");
                });
            }}
          >
            <Form.Group className="d-flex gap-2">
              <Form.Label>
                <span>URL:</span>
                <Form.Control
                  placeholder="Enter URL"
                  value={url}
                  onChange={({ currentTarget }) => setUrl(currentTarget.value)}
                />
              </Form.Label>
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                className="mt-auto my-2"
                style={{ height: "40px" }}
              >
                Shorten
              </Button>
            </Form.Group>
          </Form>
        </div>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Views</th>
              <th>Full url</th>
              <th>Short url</th>
            </tr>
          </thead>
          <tbody>
            {urls?.map((item) => {
              return (
                <tr key={item.short}>
                  <td>{item.count}</td>
                  <td style={{ padding: "5px" }}>
                    <a href={item.full} className="text-light">
                      {item.full}
                    </a>
                  </td>
                  <td style={{ padding: "5px 10px" }}>
                    <a
                      href={"api/" + item.short}
                      target="_blank"
                      rel="noreferrer"
                      className="text-light"
                    >
                      <>{`${currentUrl}api/${item.short}`}</>
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <button
          onClick={() => {
            fetch("/api", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                lasturl: urls.length > 0 ? urls[urls.length - 1].short : "",
              },
            })
              .then(async (response) => await response?.json())
              .then((data) => {
                setCurrentUrl(document.URL);
                setUrls((v) => [...v, ...data.urls]);
              });
          }}
        >
          Loading next url
        </button>
      </div>
    </main>
  );
};

export default Home;
