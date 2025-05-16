// import { useState } from "react";
import { useParams } from "react-router-dom";

export default function Embed() {
  let { id } = useParams();

  //   const [valid, setValid] = useState(false);

  //Gelen ID'yi Apiden kontrol et
  //Eğer ID geçerli ise setValid(true) yap
  //Eğer ID geçersiz ise setValid(false) yap

  return <div>{id}</div>;
}
