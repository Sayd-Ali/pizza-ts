import React, { useCallback, useEffect, useRef } from "react";
import qs from "qs";
import { useNavigate } from "react-router-dom";
import {Skeleton, PizzaBlock, Categories, SortPopup, Pagination} from "../components";
import { useSelector } from "react-redux";
import { selectFilter } from "../redux/filter/selectors";
import { FilterSliceState,Sort } from "../redux/filter/types";
import {setCategoryId, setCurrentPage, setFilters} from "../redux/filter/slice";
import {SearchPizzaParams} from '../redux/pizza/types'
import {fetchPizzas} from "../redux/pizza/asyncActions";
import {selectPizzaData} from '../redux/pizza/selectors';
import { useAppDispatch } from "../redux/store";


const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMounted = useRef(false);

  const { categoryId, sort, currentPage, searchValue } =
    useSelector(selectFilter);
  const { items: pizzas, status } = useSelector(selectPizzaData);
  const sortType = sort.sortProperty;

  const handleCategory = useCallback((idx: number) => {
    dispatch(setCategoryId(idx));
  }, []);

  const handleChangePage = useCallback((page: number) => {
    dispatch(setCurrentPage(page));
  }, []);

  const getPizzas = async () => {
    const sortBy = sortType.replace("-", "");
    const order = sortType.includes("-") ? "asc" : "desc";
    const category = categoryId > 0 ? `category=${categoryId}` : "";
    const search = searchValue ? `&search=${searchValue}` : "";

    dispatch(
      fetchPizzas({
        sortBy,
        order,
        category,
        search,
        currentPage: String(currentPage),
      })
    );
    window.scrollTo(0, 0);
  };

  // useEffect(() => {
  //   if (!window.location.search) {
  //     dispatch(fetchPizzas({} as SearchPizzaParams));
  //   }
  // }, [categoryId, sort.sortProperty, searchValue, currentPage]);
  //
  useEffect(() => {
    getPizzas();
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);
  //
  // useEffect(() => {
  //   if (window.location.search) {
  //     const params = (qs.parse(window.location.search.substring(1)) as unknown) as SearchPizzaParams;
  //     const sort = sortList.find((obj) => obj.sortProperty === params.sortBy)
  //   dispatch(setFilters({
  //     searchValue: params.search,
  //     categoryId: Number(params.category),
  //     currentPage: Number(params.currentPage),
  //     sort: sort || sortList[0],
  //   }))
  //   }
  //   isMounted.current = true;
  // }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  const pizzaItems = pizzas.map((pizza: any) => (
    <PizzaBlock key={pizza.id} {...pizza} />
  ));
  const skeletons = [...new Array(6)].map((_, index) => (
    <Skeleton key={index} />
  ));

  return (
    <div className="container">
      <div className="content__top">
        <Categories category={categoryId} handleCategory={handleCategory} />
        <SortPopup value={sort} />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {status === "error" ? (
        <div className="content__error-info">
          <h2>Произошла ошибка ☹</h2>
          <p>Не удалось получить пиццы. Попробуйте повторить попытку позже.</p>
        </div>
      ) : (
        <div className="content__items">
          {status === "loading" ? skeletons : pizzaItems}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        handleChangePage={handleChangePage}
      />
    </div>
  );
};

export default Home;
