defmodule AdventOfCode.Y2024.D02 do
  @moduledoc """
  Day 2: Red-Nosed Reports
  """

  def parse_input(filepath) do
    File.read!(filepath   )
      |> String.split("\n", trim: true)
      |> Enum.map(fn line ->
        String.split(line, " ", trim: true)
        |> Enum.map(&String.to_integer/1)
      end)
  end

 def safe?(report) do
  distances = report
    |> Enum.zip(Enum.slice(report, 1, Enum.count(report)))
    |> Enum.map(fn {a,b} -> a - b end)

  case Enum.all?(distances, fn d -> d in 1..3 end) do
    true -> 1
    false -> if Enum.all?(distances, fn d -> d in -1..-3 end), do: 1, else: 0
  end
 end

 def damper(report) do
  ri =  Enum.with_index(report)

  case Range.new(0, Enum.count(report) - 1)
    |> Enum.map(fn i ->
      Enum.reject(ri, fn {_el, index} -> i === index end)
      |> Enum.map(fn { el, _index } -> el end)
      |> safe?()
    end)
    |> Enum.any?(fn x -> x ===  1 end) do
      true -> 1
      false -> 0
    end
 end

 def solve_part1() do
  parse_input("input.txt")
  |> Enum.map(&safe?/1)
  |> Enum.sum()
  |> IO.inspect()
 end

 def solve_part2() do
  parse_input("input.txt")
  |> Enum.map(&damper/1)
  |> Enum.sum()
  |> IO.inspect()
 end
end

AdventOfCode.Y2024.D02.solve_part1()
AdventOfCode.Y2024.D02.solve_part2()
