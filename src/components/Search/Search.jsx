import { Form, Input } from "antd";
import "./Search.css";

const SearchBar = (props) => {
  var display = props.SearchWord;
  return (
    <Form>
      <Input
         className="SearchField"
        placeholder="Search"
        onChange={(e) => props.setSearchWord(e.target.value)}
        onSubmit={props.filterData()}
      ></Input>
    </Form>
  );
};

export default SearchBar;
