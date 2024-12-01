defmodule AdventOfCode.Y2024.D01 do
  @moduledoc """
  Day 1: Historian Hysteria
  """

  def split_enums(enums) do
    Enum.zip_reduce(enums, [], fn elements, acc ->
      [elements | acc]
   end)
  end

  def parse_input(filepath) do
    File.read!(filepath)
      |> String.split("\n", trim: true)
      |> Enum.map(fn l -> String.split(l, " ", trim: true) end)
      |> split_enums()
  end

  def run_part1() do
    [left, right] = parse_input("input.txt")

    left = left |> Enum.map(&String.to_integer/1) |> Enum.sort(:asc)
    right = right |> Enum.map(&String.to_integer/1) |> Enum.sort(:asc)

    Enum.zip(left, right)
      |> Enum.map(fn {l,r} -> abs(l - r) end)
      |> Enum.sum()
      |> IO.inspect()
 end

 def run_part2() do
  # swapped on purpose
  [right, left] = parse_input("input.txt")
  r_counts = Enum.frequencies(right)

  Enum.map(left, fn l ->  String.to_integer(l) * Map.get(r_counts, l, 0) end)
    |> Enum.sum()
    |> IO.inspect()
 end

end

AdventOfCode.Y2024.D01.run_part1()
AdventOfCode.Y2024.D01.run_part2()
