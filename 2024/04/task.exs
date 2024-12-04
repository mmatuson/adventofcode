defmodule AdventOfCode.Y2024.D04 do
  @moduledoc """
  Day 4: Ceres Search
  """

  def parse_input(filepath) do
    File.read!(filepath)
    |> String.split("\n", trim: true)
  end

  @doc """
  Convert the 2D array into a Map of {x,y}: <character> for easy iteration
  """
  def to_grid_map(data) do
    data
    |> Enum.with_index()
    |> Enum.reduce(%{}, fn { row, ri}, acc ->
      String.graphemes(row)
       |> Enum.with_index()
       |> Enum.into(acc, fn {col, ci } -> {{ri, ci}, col} end)
    end)
  end

  def locations_to_str(grid, locations, {x,y}) do
    Enum.map(locations, fn {dx,dy} -> grid[{dx + x, dy + y}] end) |> Enum.join("")
  end

  def x_mas?(grid, {x,y}) do
    locations = [
      [{-1, -1}, {0, 0}, {1, 1}],
      [{-1, 1}, {0, 0}, {1, -1}]
    ]
    |> Enum.map(&locations_to_str(grid, &1, {x,y}))
    |> Enum.all?(fn s -> String.contains?(s, ["MAS", "SAM"]) end)
    |> (fn bool -> if bool, do: 1, else: 0 end).()
  end

  def xmas?(grid, {x,y}) do
    directions = [{0,-1}, {0, 1}, {-1, 0}, {1, 0}, {-1, -1}, {1, 1}, {1,-1}, {-1, 1}]

    Enum.map(directions, fn {x,y} ->
       1..3 |> Enum.map(fn r -> {x * r, y * r} end)
    end)
    |> Enum.map(&locations_to_str(grid, &1, {x,y}))
    |> Enum.filter(fn s -> String.contains?(s, ["MAS"]) end)
    |> Enum.count()
  end

  def solve_part1() do
    grid = parse_input("input.txt") |> to_grid_map()

    grid
    |> Map.keys()
    |> Enum.filter(fn {x,y} -> grid[{x,y}] === "X" end)
    |> Enum.map(fn a -> xmas?(grid, a) end)
    |> Enum.sum()
    |> IO.inspect()
  end

  def solve_part2() do
    grid = parse_input("input.txt") |> to_grid_map()

    grid
    |> Map.keys()
    |> Enum.filter(fn {x,y} -> grid[{x,y}] === "A" end)
    |> Enum.map(fn a -> x_mas?(grid, a) end)
    |> Enum.sum()
    |> IO.inspect()
  end
end

AdventOfCode.Y2024.D04.solve_part1()
AdventOfCode.Y2024.D04.solve_part2()
