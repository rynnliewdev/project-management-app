import React from "react";
import { Card, Typography } from "@material-ui/core";

export default function notFound(props) {
  return (
    <Card style={{ borderRadius: 15, boxShadow: "none" }}>
      <Typography style={{ textAlign: "center", margin: 15 }}>
        {props.message}
      </Typography>
    </Card>
  );
}
