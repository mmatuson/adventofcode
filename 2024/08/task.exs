defmodule AdventOfCode.Y2024.D08 do
  @moduledoc """
  Day 8: Resonant Collinearity
  """

  def parse_input(filepath) do
    File.read!(filepath)
    |> String.split("\n", trim: true)
  end

  def to_grid_map(data) do
    grid = data
    |> Enum.with_index()
    |> Enum.reduce(%{}, fn { row, ri}, acc ->
      String.graphemes(row)
       |> Enum.with_index()
       |> Enum.into(acc, fn {col, ci } -> {{ri, ci}, col} end)
    end)

    row_len = Enum.count(data)
    col_len = Enum.at(data, 0) |> byte_size()

    {grid, row_len, col_len}
  end

  defp sign(a) when a > 0, do: 1
  defp sign(0), do: 0
  defp sign(a) when a < 0, do: -1

  def direction({x1, y1}, {x2, y2}) do
    dx = sign(x2 - x1)
    dy = sign(y2 - y1)
    {dx, dy}
  end

  def at_least_two_apart?({x1, y1}, {x2, y2}) do
    abs(x2 - x1) >= 1 || abs(y2 - y1) >= 1
  end

  def oob?({x,y},  row_len, col_len) do
    (x <  0 || x > row_len - 1)  || (y < 0 || y > col_len - 1)
  end

  def solve_part1() do
    data = parse_input("input.txt")
    {grid, row_len, col_len } = to_grid_map(data)

    antennas = Enum.filter(grid, fn {_, value} -> value !== "." end)

    anti_nodes = MapSet.new([])
    result = for {{x,y}, antenna} <- antennas,
                 {{ox,oy}, other_antenna} <- antennas,
              reduce: anti_nodes do
      acc ->
        case antenna === other_antenna do
          false -> acc
          true -> cond do
            at_least_two_apart?({x,y}, {ox,oy}) ->
              {dx1, dy1} = direction({x,y},{ox,oy})
              {dx2, dy2} = direction({ox,oy},{x,y})
              sx = abs(ox - x)
              sy = abs(oy - y)
              acc = for pos <- [
                    {ox + (dx1 * sx), oy + (dy1 * sy)},
                    {x + (dx2 * sx), y + (dy2 * sy)}
              ],
                 !oob?(pos, row_len, col_len),  pos !== {x,y}, pos !== {ox,oy}, reduce: acc do
                  aacc ->
                    MapSet.put(aacc, pos)
                end

              acc
            true ->
              acc
        end
      end
    end
    result
    |> MapSet.size()
    |> IO.inspect()
  end



  def solve_part2() do
    data = parse_input("input.txt")
    {grid, row_len, col_len } = to_grid_map(data)

    antennas = Enum.filter(grid, fn {_, value} -> value !== "." end)

    anti_nodes = MapSet.new([])
    result = for {{x,y}, antenna} <- antennas,
                 {{ox,oy}, other_antenna} <- antennas,
                 antenna === other_antenna,

              reduce: anti_nodes do
              acc ->

              {dx1, dy1} = direction({x,y},{ox,oy})
              {dx2, dy2} = direction({ox,oy},{x,y})
              sx = abs(ox - x)
              sy = abs(oy - y)
              acc = for i <- 1..100, pos <- [
                                {ox + (dx1 * (sx * i)), oy + (dy1 * (sy * i))},
                                {x + (dx2 * (sx * i)), y + (dy2 * (sy * i))}
                                ],
                 !oob?(pos, row_len, col_len),  pos !== {x,y}, pos !== {ox,oy}, reduce: acc do
                  aacc ->
                    MapSet.put(aacc, pos)
                end

              acc
    end
    result

    result = for {{x,y}, _} <- antennas, reduce: result do
      acc -> MapSet.put(acc, {x,y})
    end
    MapSet.size(result)
    |> IO.inspect()

  end

end

AdventOfCode.Y2024.D08.solve_part1()
AdventOfCode.Y2024.D08.solve_part2()
