defmodule AdventOfCode.Y2024.D05 do
  @moduledoc """
  Day 5: Print Queue
  """

  def parse_input(filepath) do
    File.read!(filepath)
     |> String.split(~r/\n{2,}/)
  end

  def parse_rules(rules) do
    rules |> String.split("\n", trim: true)
     |> Enum.reduce(%{}, fn r, acc ->
      [from, to] = String.split(r, "|") |> Enum.map(&String.to_integer/1)
      Map.update(acc, from, [to], fn curr -> [to | curr] end)
    end)
  end

  def parse_updates(updates) do
    updates |> String.split("\n", trim: true)
    |> Enum.map(fn p -> String.split(p, ",") |> Enum.map(&String.to_integer/1) end)
  end

  def correct?(update, rules) do
    update
    |> Enum.with_index()
    |> Enum.all?(fn {p, i} ->
      case rules[p] do
        nil -> 0
        f -> f
          |> Enum.map(fn x -> Enum.find_index(update, fn i -> i === x end) end)
          |> Enum.all?(fn v -> i < v end)
      end
    end)
  end

  def reorder(update, rules) do
    update |> Enum.sort(fn a, b -> b in Map.get(rules, a, []) end)
  end

  def solve_part1() do
    [rules, updates] = parse_input("input.txt")
    rules = parse_rules(rules)
    updates = parse_updates(updates)

    Enum.map(updates, fn u ->
      if correct?(u, rules), do:  Enum.at(u, div(Enum.count(u), 2)), else: 0
    end)
    |> Enum.sum()
    |> IO.inspect()
  end

  def solve_part2() do
    [rules, updates] = parse_input("input.txt")

    rules = parse_rules(rules)
    updates = parse_updates(updates)

    Enum.map(updates, fn u ->
      case correct?(u, rules) do
        true ->  0
        false ->
          new_l = reorder(u, rules)
          unless correct?(new_l, rules) do
            raise ArgumentError, message: "list reorder failed"
          end
          Enum.at(new_l, div(Enum.count(new_l), 2))
      end
    end)
    |> Enum.sum()
    |> IO.inspect()
  end
end

AdventOfCode.Y2024.D05.solve_part1()
AdventOfCode.Y2024.D05.solve_part2()
