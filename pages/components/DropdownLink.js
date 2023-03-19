import Link from "next/link";
import React from "react";

export default function DropdownLink(props) {
  const { href, children, ...rest } = props;
  return (
    <Link href={href}>
      <div {...rest}>{children}</div>
    </Link>
  );
}
