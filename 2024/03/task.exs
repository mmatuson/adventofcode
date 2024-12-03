defmodule AdventOfCode.Y2024.D03 do
  @moduledoc """
  Day 3: Mull It Over
  """

  def parse_input(filepath) do
    File.read!(filepath)
  end

  def parse_mul(p) do
    Regex.scan(~r/mul\((\d+),(\d+)\)/, p, capture: :all_but_first)
    |> Enum.map(fn [a,b] -> String.to_integer(a) * String.to_integer(b) end)
    |> Enum.sum()
  end

  def scan(["don't", _p | rest], acc), do: scan(rest, acc)
  def scan(["do", p | rest], acc), do:  scan(rest, acc + parse_mul(p))
  def scan([p | rest], acc), do: scan(rest, acc + parse_mul(p))
  def scan([], acc), do: acc

  def parse_toggle(program) do
    Regex.split(~r/(don't()|do())(\.*)/, program, include_captures: true)
  end

  def solve_part1() do
    parse_input("input.txt")
      |> parse_mul()
      |> IO.inspect()
  end

  def solve_part2() do
    parse_input("input.txt")
      |> parse_toggle
      |> scan(0)
      |> IO.inspect()
  end
end

AdventOfCode.Y2024.D03.solve_part1()
AdventOfCode.Y2024.D03.solve_part2()
