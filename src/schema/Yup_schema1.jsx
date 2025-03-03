import React from "react"
import * as Yup from "yup";
export const Yup_schema = Yup.object({
  username: Yup.string().min(3).max(20).required("please fill username"),
//   email: Yup.string().email().required("please fill this email"),
  password: Yup.string().min(6).required("please fill this password"),
});

